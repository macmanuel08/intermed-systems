import {sql} from '@vercel/postgres';

export async function fetchDoctorNames() {
    try {
      const data = await sql`
        SELECT name, id
        FROM users
        WHERE role='doctor'`;
  
      return data.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error("Failed to fetch the doctor's name.");
    }
}