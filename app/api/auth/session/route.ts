import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  const cookieStore = req.headers.get('cookie');

  if (!cookieStore || !cookieStore.includes('session_token')) {
    return NextResponse.json({ message: 'No active session' }, { status: 401 });
  }

  // Extract token from cookie
  const token = cookieStore
    .split('; ')
    .find((cookie) => cookie.startsWith('session_token='))
    ?.split('=')[1];

  if (!token) {
    return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
  }

  try {
    // Decode JWT token
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
      return NextResponse.json({ message: 'JWT_SECRET is missing' }, { status: 500 });
    }

    const decoded = jwt.verify(token, jwtSecret);

    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Invalid session token: ${error}` }, { status: 401 });
  }
}
