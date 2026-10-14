import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from './lib/auth0'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicRoutes = [
    '/',
    '/about',
    '/careers',
    '/contact',
    '/blog',
    '/partner',
    '/press',
    '/help',
    '/cookies',
    '/privacy',
    '/terms',
    '/job-openings',
    '/sitemap.xml',
    '/robots.txt',
    '/favicon.ico'
  ]

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  return await auth0.middleware(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    '/((?!_next/static|_next/image).*)',
  ],
}
