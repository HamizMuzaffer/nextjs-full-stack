import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // Make sure it's the same across the app
  });

  const url = request.nextUrl;

  console.log("Token in Middleware:", token); // Check if the token shows here

  // Handle redirects
  if (token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify') ||
    url.pathname === '/'
  )) {
    return NextResponse.redirect(new URL('/user-dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/user-dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

// Match specific routes
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/user-dashboard',
    '/verify/:path*',
  ],
};
