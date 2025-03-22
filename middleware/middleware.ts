import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// For API Routes Middleware
export function middleware(req: NextApiRequest) {
  const session = getSession(req);

  // Check if the URL is defined (it should always be, but we'll be cautious)
  const url = req.url || '';  // For NextApiRequest, url should be defined

  // Define the paths that should be protected (for example, `/dashboard`)
  const protectedPaths = ['/dashboard'];

  // If the session is missing and the requested path is protected, redirect to login
  if (!session && protectedPaths.some((path) => url.includes(path))) {
    return NextResponse.redirect(new URL('/login', url));
  }

  // If the session is valid or the path is not protected, continue the request
  return NextResponse.next();
}

// Optionally, specify which routes the middleware should apply to
export const config = {
  matcher: ['/dashboard', '/profile', '/settings'], // Add paths that need protection
};
