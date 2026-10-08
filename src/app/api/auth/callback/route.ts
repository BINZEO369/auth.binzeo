import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { isValidUsername, normalizeUsername } from '@/lib/username'

async function prepareGoogleProfile(user: {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}) {
  const admin = getSupabaseAdmin()
  const metadata = user.user_metadata ?? {}
  const givenName = String(metadata.given_name ?? metadata.first_name ?? '').trim()
  const familyName = String(metadata.family_name ?? metadata.last_name ?? '').trim()
  const displayName = String(metadata.full_name ?? metadata.name ?? `${givenName} ${familyName}`).trim()
  const emailName = (user.email ?? '').split('@')[0] ?? ''
  const rawBase = String(metadata.user_name ?? metadata.preferred_username ?? emailName)
  const base = normalizeUsername(rawBase).replace(/[^a-z0-9_]/g, '').replace(/^[^a-z]+/, '').slice(0, 24) || `user${user.id.slice(0, 8)}`

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id, username')
    .eq('id', user.id)
    .maybeSingle()
  if (profileError) throw profileError

  let username = profile?.username ?? ''
  if (!username || !isValidUsername(username)) {
    const candidates = [base, ...Array.from({ length: 20 }, (_, index) => `${base.slice(0, 27)}${index + 1}`)]
    const { data: usedRows, error: usedError } = await admin
      .from('profiles')
      .select('username')
      .in('username', candidates)
    if (usedError) throw usedError
    const used = new Set((usedRows ?? []).map((row) => String(row.username).toLowerCase()))
    username = candidates.find((candidate) => isValidUsername(candidate) && !used.has(candidate)) ?? `user${user.id.slice(0, 8)}`
  }

  const { error: updateError } = await admin
    .from('profiles')
    .update({
      first_name: givenName || null,
      last_name: familyName || null,
      display_name: displayName || emailName || 'Google user',
      username,
      profile_photo_url: String(metadata.avatar_url ?? metadata.picture ?? '') || null,
      account_status: 'active',
    })
    .eq('id', user.id)
  if (updateError) throw updateError
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${origin}/signin?error=missing_code`)
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        `${origin}/signin?error=${encodeURIComponent(error.message)}`
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) await prepareGoogleProfile(user)

    return NextResponse.redirect(`${origin}${next}`)
  } catch (err) {
    console.error('[CALLBACK_ERROR]', err)
    return NextResponse.redirect(`${origin}/signin?error=callback_failed`)
  }
}
