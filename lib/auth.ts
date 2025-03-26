import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
    .regex(/[\W_]/, { message: 'Password must contain at least one special character' })
});

export async function authenticateUser(email: string, password: string) {
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { error: validation.error.format() };
  }

  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!user.rows.length) return null;
  
  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) return null;

  return { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email };
}