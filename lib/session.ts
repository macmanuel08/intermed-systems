import { NextApiRequest } from 'next';
import { serialize, parse } from 'cookie';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET || 'your-secret-key';

export function createSession(user: { id: number; name: string; email: string }) {
    const token = jwt.sign(user, SECRET, { expiresIn: '1h' });
    return serialize('session', token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
  }

export function getSession(req: NextApiRequest) {
  const cookies = parse(req.headers.cookie || '');
  if (!cookies.session) return null;
  try {
    return jwt.verify(cookies.session, SECRET);
  } catch {
    return null;
  }
}