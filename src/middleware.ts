import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/dashboard']
const AUTH_ONLY = ['/signin', '/signup', '/signin', '/signup']

function createRateLimitClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: () => undefined,
      },
    },
  )
}

async function consumeRateLimit(req: NextRequest, bucketKey: string, limit: number) {
  const client = createRateLimitClient(req)
  return client.rpc('consume_api_rate_limit', {
    p_bucket_key: bucketKey,
    p_limit: limit,
    p_window_seconds: 60,
  })
}

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', req.nextUrl.pathname)
  let res = NextResponse.next({ request: { headers: requestHeaders } })
  const pathname = req.nextUrl.pathname
  const isApiRequest = pathname.startsWith('/api/')

  if (isApiRequest) {
    const origin = req.headers.get('origin')
    const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && origin && origin !== req.nextUrl.origin && origin !== configuredOrigin) {
      return NextResponse.json(
        { success: false, error: { message: 'Cross-origin request rejected.', code: 'CSRF_ORIGIN_REJECTED' } },
        { status: 403, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}|${pathname}`))
    const bucketKey = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
    const limit = pathname.startsWith('/api/auth/') ? 20 : 60
    const { data: rateData, error: rateError } = await consumeRateLimit(req, bucketKey, limit)
    if (!rateError && rateData?.[0]?.allowed === false) {
      return NextResponse.json(
        { success: false, error: { message: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' } },
        { status: 429, headers: { 'Retry-After': String(rateData[0].retry_after_seconds ?? 60), 'Cache-Control': 'no-store' } },
      )
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({ request: { headers: requestHeaders } })
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
        },
      },
    },
  )
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && PROTECTED.some((p) => pathname.startsWith(p))) {
    const url = req.nextUrl.clone()
    url.pathname = '/signin'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  const isGoogleSetup = pathname === '/signup' && req.nextUrl.searchParams.get('google_setup') === '1'
  if (user && AUTH_ONLY.some((p) => pathname.startsWith(p)) && !isGoogleSetup) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
