import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const COOKIE_NAME = 'wy_token';

// Route prefix → required role(s)
const PROTECTED: Record<string, string[]> = {
  '/app/member': ['MEMBER', 'ADMIN'],
  '/app/supporter': ['SUPPORTER', 'ADMIN'],
  '/admin': ['ADMIN'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;

  // Redirect logged-in users away from auth pages
  if (user && (pathname === '/login' || pathname.startsWith('/register'))) {
    return redirectByRole(user.role, request);
  }

  // Protect private routes
  for (const [prefix, roles] of Object.entries(PROTECTED)) {
    if (pathname.startsWith(prefix)) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      if (!roles.includes(user.role)) {
        return redirectByRole(user.role, request);
      }
    }
  }

  return NextResponse.next();
}

function redirectByRole(role: string, request: NextRequest) {
  const dest =
    role === 'ADMIN'
      ? '/admin'
      : role === 'SUPPORTER'
        ? '/app/supporter/home'
        : '/app/member/home';
  return NextResponse.redirect(new URL(dest, request.url));
}

export const config = {
  matcher: [
    '/app/:path*',
    '/admin/:path*',
    '/login',
    '/register/:path*',
  ],
};
