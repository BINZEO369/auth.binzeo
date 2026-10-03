import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    return NextResponse.redirect(`${origin}${next}`)
  } catch (err) {
    console.error('[CALLBACK_ERROR]', err)
    return NextResponse.redirect(`${origin}/signin?error=callback_failed`)
  }
}
