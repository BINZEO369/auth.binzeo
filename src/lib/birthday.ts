import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { EMAIL_FROM, buildBirthdayEmail, transporter } from "@/lib/email/transporter";

export const MINIMUM_AGE = 13;

export function validateBirthDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Enter a valid date of birth.";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return "Enter a valid date of birth.";
  const today = new Date();
  const age = today.getUTCFullYear() - date.getUTCFullYear() - ((today.getUTCMonth() + 1 < date.getUTCMonth() + 1 || (today.getUTCMonth() + 1 === date.getUTCMonth() + 1 && today.getUTCDate() < date.getUTCDate())) ? 1 : 0);
  if (date > today) return "Date of birth cannot be in the future.";
  if (age < MINIMUM_AGE) return `You must be at least ${MINIMUM_AGE} years old to create a BINZEO account.`;
  if (age > 120) return "Please enter a valid date of birth.";
  return null;
}

export function calculateAge(value: string, asOf = new Date()) {
  const birth = new Date(`${value}T00:00:00Z`);
  let age = asOf.getUTCFullYear() - birth.getUTCFullYear();
  const month = asOf.getUTCMonth() - birth.getUTCMonth();
  if (month < 0 || (month === 0 && asOf.getUTCDate() < birth.getUTCDate())) age -= 1;
  return age;
}

export async function upsertUserBirthday({ userId, email, displayName, birthDate }: { userId: string; email: string; displayName: string; birthDate: string }) {
  const errorMessage = validateBirthDate(birthDate);
  if (errorMessage) throw new Error(errorMessage);
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("user_birthdays").upsert({ user_id: userId, birth_date: birthDate, email, display_name: displayName }, { onConflict: "user_id" });
  if (error) throw error;
}

export async function sendBirthdayEmails({ siteUrl, limit = 100 }: { siteUrl: string; limit?: number }) {
  const admin = getSupabaseAdmin();
  const today = new Date();
  const todayMonth = today.getUTCMonth() + 1;
  const todayDay = today.getUTCDate();
  const currentYear = today.getUTCFullYear();
  const { data: rows, error } = await admin.from("user_birthdays").select("user_id, email, display_name, birth_date, current_age, last_birthday_email_year").eq("birth_month", todayMonth).eq("birth_day", todayDay).or(`last_birthday_email_year.is.null,last_birthday_email_year.lt.${currentYear}`).limit(limit);
  if (error) throw error;
  let sent = 0;
  let failed = 0;
  for (const row of rows ?? []) {
    const age = calculateAge(row.birth_date, today);
    try {
      const content = buildBirthdayEmail(row.display_name || "there", age, siteUrl);
      await transporter.sendMail({ from: EMAIL_FROM, to: row.email, subject: content.subject, html: content.html });
      await admin.from("user_birthdays").update({ current_age: age, age_calculated_at: today.toISOString().slice(0, 10), last_birthday_email_year: currentYear, last_birthday_email_sent_at: new Date().toISOString() }).eq("user_id", row.user_id);
      sent += 1;
    } catch (error) {
      failed += 1;
      console.error("[BIRTHDAY_EMAIL_ERROR]", { userId: row.user_id, error });
    }
  }
  return { matched: rows?.length ?? 0, sent, failed };
}
