import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('auth')?.value === 'true';
  const isLoginPage = pathname === '/login';

  console.log(`Middleware Check: Path=${pathname}, IsAuth=${isAuthenticated}, IsLogin=${isLoginPage}`);

  if (isAuthenticated && isLoginPage) {
    console.log(`Authenticated user on /login, redirecting to /`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuthenticated && !isLoginPage) {
    console.log(`Unauthenticated access to ${pathname}, redirecting to /login`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log(`Allowing access to ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - data (static data files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|data).*)',
  ],
} 