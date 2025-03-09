import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protected admin routes
    if (path.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Protected writer routes
    if (path.startsWith('/writer')) {
      if (!['admin', 'writer'].includes(token?.role as string)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/writer/:path*',
    '/api/articles/:path*',
    '/api/comments/:path*',
  ],
};
