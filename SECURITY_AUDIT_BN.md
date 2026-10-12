

---

# Live Supabase Database Verification Addendum

এই অংশটি live Supabase project `elfljgkswcsaiqtzxjbe` সরাসরি inspect করার পর যোগ করা হলো।

## যা ভালো অবস্থায় আছে

- Live public schema-র table-গুলোতে RLS enabled পাওয়া গেছে।
- `admin_access`, `profiles`, `consent_*`, analytics, security এবং user-owned table-গুলোর বেশিরভাগে `FORCE ROW LEVEL SECURITY` enabled।
- `get_admin_account_statuses()`, `get_admin_directory()`, `get_admin_auth_providers()` এবং `admin_set_account_status()` function-এ `private.is_admin(auth.uid())` check আছে। তাই আগের “admin RPC-তে কোনো internal check নেই” আশঙ্কাটি live definition অনুযায়ী সঠিক নয়।
- `profiles`, addresses, contacts, devices, login history, activity logs এবং sector access policy-তে owner/admin boundary দেখা গেছে।

## C-03 — `cleanup_expired_pending_accounts()` authenticated role-এ executable এবং কোনো admin check নেই

**Live evidence:**

- Function: `public.cleanup_expired_pending_accounts()`
- `SECURITY DEFINER`
- Execute grant: `authenticated`
- Function body-তে `auth.uid()` বা admin permission check নেই।
- Function pending profile-এর activity logs, login history, admin activity logs এবং `auth.users` থেকে user delete করতে পারে।

**Risk:**

যে কোনো authenticated user সরাসরি RPC call করে cleanup চালাতে পারলে সদ্য তৈরি pending account-গুলো delete বা account-creation flow নষ্ট করতে পারে। Function-টির intended use যদি scheduled cleanup হয়, তাহলে এটিকে public authenticated RPC হিসেবে রাখা যাবে না।

**Required fix:**

```sql
revoke all on function public.cleanup_expired_pending_accounts() from public;
revoke all on function public.cleanup_expired_pending_accounts() from authenticated;
grant execute on function public.cleanup_expired_pending_accounts() to service_role;
```

এরপর cron/Edge Function/service-role worker দিয়ে নির্দিষ্ট schedule-এ চালান। বিকল্পভাবে function-এর শুরুতে কঠোর admin/service authorization যোগ করুন।

## C-04 — Sensitive table-এ অতিরিক্ত table grants

Live grants-এ `anon` বা `authenticated`-এর জন্য অতিরিক্ত privilege দেখা গেছে, যেমন:

- `admin_access`
- `login_attempt_limits`
- `login_limit_exceeded`
- `password_reset_challenges`
- `password_change_events`
- `two_factor_challenges`
- `two_factor_authentication_events`
- `temporary_login_tokens`
- `user_passkeys`
- `profiles`

কিছু sensitive table-এ RLS policy না থাকায় বর্তমানে RLS default-deny আচরণ করছে; তাই এটিকে তাৎক্ষণিক data leak হিসেবে নিশ্চিত করা যাচ্ছে না। কিন্তু `GRANT ALL` রেখে দেওয়া নিরাপদ নয়—ভবিষ্যতে policy পরিবর্তন হলে একই grant accidental exposure তৈরি করবে।

**Required fix:**

- `anon` থেকে sensitive table-এর সব privilege revoke করুন।
- `authenticated`-কে শুধু প্রয়োজনীয় `SELECT/INSERT/UPDATE/DELETE` দিন।
- `REFERENCES`, `TRIGGER`, `TRUNCATE` সাধারণ application role থেকে revoke করুন।
- Password/OTP/2FA challenge table সরাসরি client role-কে expose না করে শুধু locked-down RPC ব্যবহার করুন।

## H-08 — `private.has_admin_permission()` এবং `private.is_admin()`-এ PUBLIC EXECUTE

Live definition-এ দুইটি security-definer helper function-এর `PUBLIC:EXECUTE` grant দেখা গেছে। Function-গুলো data পরিবর্তন করছে না এবং RLS-এ current user-এর বদলে supplied UUID পরীক্ষা করে—তাই এটি সরাসরি privilege escalation প্রমাণ নয়। তবে arbitrary UUID দিয়ে admin membership/permission oracle তৈরি করতে পারে এবং helper-গুলো unnecessarily public।

**Required fix:**

- `private` schema PostgREST/API exposed নয় তা নিশ্চিত করুন।
- `PUBLIC` execute revoke করুন।
- RLS/function invocation-এর প্রয়োজন অনুযায়ী সীমিত role-এ execute grant রাখুন।
- Permission lookup-এ সম্ভব হলে `requested_user_id = auth.uid()` enforce করুন, অথবা admin-only internal wrapper ব্যবহার করুন।

## Updated conclusion after live DB inspection

### নিশ্চিতভাবে ভালো

- Live database-এ RLS আছে এবং বেশিরভাগ sensitive table force-RLS করা।
- Admin RPC-তে internal admin check আছে।
- Owner-level policies সাধারণত সঠিকভাবে `auth.uid()` ভিত্তিক।

### এখনই ঠিক করতে হবে

1. `cleanup_expired_pending_accounts()` থেকে `authenticated` execute revoke করা।
2. Sensitive table-এর `anon`/`authenticated` অতিরিক্ত grants সরানো।
3. Public profile API থেকে email সরানো।
4. Temporary login token-এ 2FA bypass policy ঠিক করা।
5. `private` helper function-এর PUBLIC execute সীমিত করা।
6. API-level headers, CSRF/Origin checks এবং rate limits যোগ করা।

সুতরাং database আপডেট হয়েছে এবং RLS ভিত্তি ভালো—কিন্তু **database privileges এবং cleanup function-এর authorization এখনও production security issue**।
