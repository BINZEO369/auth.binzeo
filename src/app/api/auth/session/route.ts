import { createClient } from '@/lib/supabase/server'
import { ok, fail } from '@/lib/api/response'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return fail('Unauthorized', 401, 'UNAUTHORIZED')
    }

    return ok({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name ?? null,
        phone: user.user_metadata?.phone ?? null,
      },
    })
  } catch (err) {
    console.error('[SESSION_ERROR]', err)
    return fail('Internal server error', 500, 'INTERNAL_ERROR')
  }
}
