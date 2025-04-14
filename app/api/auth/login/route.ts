import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { serialize } from 'cookie'; // Cookie serialization
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  try {
    // Find the user from the database
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
    
    const jwtSecret = process.env.JWT_SECRET as string;

    // Generate a JWT session token
    const sessionToken = jwt.sign(
        { userId: user.id, email: user.email, name: user.name, role: user.role }, // Payload
        jwtSecret, // Secret key
        { expiresIn: '1h' } // Expiration time (1 hour)
    );

    const cookie = serialize('session_token', sessionToken, {
      httpOnly: true, // Ensures the cookie can't be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      maxAge: 60 * 60 * 12, // 12 hour expiry
      path: '/', // Available throughout the site
    });

    // Set the cookie in the response header
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
