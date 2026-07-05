import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. If requesting auth-related routes or static assets, pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Auth Page Routing (prevent logged in users from seeing login/register again)
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      if (token.role === 'CLIENT') {
        return NextResponse.redirect(new URL('/portal', req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    return NextResponse.next();
  }

  // 3. Client Portal Route Protection
  if (pathname.startsWith('/portal')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?isPortal=true', req.url));
    }
    if (token.role !== 'CLIENT') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // Enforce temporary password change
    if (token.needsPasswordChange && pathname !== '/portal/change-password') {
      return NextResponse.redirect(new URL('/portal/change-password', req.url));
    }
    
    return NextResponse.next();
  }

  // 4. Designer / Admin Dashboard Route Protection
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/clients') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/kanban') ||
    pathname.startsWith('/communications') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/api/') // Protect custom API routes except auth
  ) {
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Enforce temporary password change for Staff
    if (token.needsPasswordChange && pathname !== '/change-password') {
      return NextResponse.redirect(new URL('/change-password', req.url));
    }
    if (token.role === 'CLIENT') {
      if (pathname.startsWith('/api/')) {
        if (
          pathname.startsWith('/api/portal') ||
          pathname.startsWith('/api/upload') ||
          pathname.startsWith('/api/communications') ||
          pathname.startsWith(`/api/clients/${token.id}`)
        ) {
          return NextResponse.next();
        }
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/portal', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/clients/:path*',
    '/orders/:path*',
    '/kanban/:path*',
    '/communications/:path*',
    '/tasks/:path*',
    '/portal/:path*',
    '/change-password/:path*',
    '/api/:path*',
  ],
};
