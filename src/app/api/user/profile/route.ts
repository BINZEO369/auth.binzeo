import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ok, fail } from '@/lib/api/response'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return fail('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      return fail(error.message, 400, 'PROFILE_FETCH_FAILED')
    }

    return ok({ profile })
  } catch (err) {
    console.error('[PROFILE_GET_ERROR]', err)
    return fail('Internal server error', 500, 'INTERNAL_ERROR')
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return fail('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const body = await req.json()
    const allowed = ['full_name', 'phone', 'avatar_url'] as const
    const patch: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) patch[key] = body[key]
    }

    if (Object.keys(patch).length === 0) {
      return fail('No valid fields to update', 422, 'NO_UPDATE_FIELDS')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return fail(error.message, 400, 'PROFILE_UPDATE_FAILED')
    }

    return ok({ profile: data })
  } catch (err) {
    console.error('[PROFILE_PATCH_ERROR]', err)
    return fail('Internal server error', 500, 'INTERNAL_ERROR')
  }
}
