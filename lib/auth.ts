import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';

export async function authenticateUser(email: string, password: string) {
  console.log(password)
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!user.rows.length) return null;
  
  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) return null;

  return { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email };
}