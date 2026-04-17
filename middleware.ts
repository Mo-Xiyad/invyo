import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  if (!pathname.startsWith('/logistics')) {
    return NextResponse.next()
  }

  /** Default passcode for hosts; set `LOGISTICS_SECRET` in env to override. */
  const acceptedKey = process.env.LOGISTICS_SECRET
  if (!acceptedKey) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const key = searchParams.get('key')
  if (key !== acceptedKey) {
    const u = new URL('/logistics-gate', request.url)
    u.searchParams.set('reason', 'bad_or_missing')
    return NextResponse.redirect(u)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/logistics', '/logistics/:path*'],
}
