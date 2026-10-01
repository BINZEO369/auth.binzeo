import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { signupSchema } from '@/lib/validators/auth'
import { ok, fail } from '@/lib/api/response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid input'
      return fail(firstError, 422, 'VALIDATION_ERROR')
    }

    const { email, password, full_name, phone } = parsed.data
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone: phone || null },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      },
    })

    if (error) {
      return fail(error.message, 400, error.name)
    }

    return ok(
      {
        user: data.user
          ? { id: data.user.id, email: data.user.email, full_name }
          : null,
        requires_email_confirmation: !data.session,
      },
      201
    )
  } catch (err) {
    console.error('[SIGNUP_ERROR]', err)
    return fail('Internal server error', 500, 'INTERNAL_ERROR')
  }
}
