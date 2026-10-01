import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validators/auth'
import { ok, fail } from '@/lib/api/response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid input'
      return fail(firstError, 422, 'VALIDATION_ERROR')
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      return fail('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    }

    return ok({
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name ?? null,
      },
    })
  } catch (err) {
    console.error('[LOGIN_ERROR]', err)
    return fail('Internal server error', 500, 'INTERNAL_ERROR')
  }
}
