import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
  
  const cookie = serialize('session_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    maxAge: -1, 
    path: '/',
  });

  const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  response.headers.set('Set-Cookie', cookie);

  return response;
}
