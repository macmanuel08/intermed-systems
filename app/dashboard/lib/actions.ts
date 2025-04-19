'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath  } from 'next/cache';
import { redirect } from 'next/navigation';
import { DoctorType } from '@/types';

const AppointmentFormSchema = z.object({
    user_id: z.string(),
    doctor_id: z.string(),
    date: z.string(),
    time: z.string(),
    description: z.string(),
    status: z.string(),
    appointment_queue_number: z.string(),
});

export type AppointmentState = {
    errors?: {
      user_id?: string[];
      doctor_id?: string[];
      date?: string[];
      time?: string[];
      description?: string[];
      status?: string[];
      appointment_queue_number?: string[];
    };
    message?: string | null;
  };

export async function createAppointment(prevState: AppointmentState, formData: FormData) {
    
    const validatedFields = AppointmentFormSchema.safeParse({
      user_id: formData.get('user_id'),
      doctor_id: formData.get('doctor_id'),
      date: formData.get('date'),
      time: formData.get('time'),
      description: formData.get('description'),
      status: formData.get('status'),
      appointment_queue_number: formData.get('appointment_queue_number')
    });
   
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Make the Appointment.',
      };
    }

    const { 
        user_id,
        doctor_id,
        date,
        time,
        description,
        status,
        appointment_queue_number,
    } = validatedFields.data;
   
    try {
      await sql`
        INSERT INTO appointments (
            user_id,
            doctor_id,
            date,
            "time",
            description,
            status,
            appointment_queue_number
        )
        VALUES (
            ${user_id},
            ${doctor_id},
            ${date},
            ${time},
            ${description},
            ${status},
            ${appointment_queue_number}
        )
      `;
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Appointment.',
        error: error,
      };
    }
   
    revalidatePath('/dashboard/appointments');
    redirect('/dashboard/appointments');
};

export async function getDoctorInfo(id: string): Promise<DoctorType | null> {
  try {
    const result = await sql`
      SELECT room_number, available_from, available_until
      FROM doctors
      WHERE user_id = ${id}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Failed to get doctor's room:", error);
    return null;
  }
}

export async function generateTimeSlots(
  id: string,
  selectedDate: Date | null,
  startTime: string,
  endTime: string,
  intervalMinutes: number
) {

  let takenSlots: string[] = [];

  try {
    if (selectedDate != null) {
      const fetchedTakenSlots = await sql`
        SELECT time
        FROM appointments
        WHERE date = ${selectedDate?.toISOString().split('T')[0]} AND doctor_id = ${id}
        ORDER BY time ASC
      `;
      takenSlots = fetchedTakenSlots.rows.map(row => row.time as string);
    }
  } catch (error) {
    console.error("Failed to get doctor's current time slots:", error);
  }

  const pad = (num: number) => num.toString().padStart(2, '0');
  function formatTime(hour: number, minute: number): string {
    return `${pad(hour)}:${pad(minute)}:00`;
  }

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const start = new Date();
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);

  const formattedTimes: string[] = [];
  const rawTimes: string[] = [];

  let index = 0;
  const takenSlotsLength = takenSlots.length;

  while (start <= end) {
    const hour = start.getHours();
    const minute = start.getMinutes();

    const currentTime = formatTime(hour, minute);
    
    if (index < takenSlotsLength && takenSlots[index] === currentTime) {
      index++;
      start.setMinutes(start.getMinutes() + intervalMinutes);
      continue;
    }

    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const formatted = `${displayHour}:${pad(minute)} ${period}`;
    const raw = `${pad(hour)}:${pad(minute)}:00`;

    formattedTimes.push(formatted);
    rawTimes.push(raw);

    start.setMinutes(start.getMinutes() + intervalMinutes);
  }

  return {
    formattedTimes,
    rawTimes,
  };
}

export async function getAvailableDays(id: string): Promise<number[] | null> {
  try {
    const availableDays = await sql`
      SELECT available_days
      FROM doctors
      WHERE user_id = ${id}
    `;

    return availableDays.rows[0].available_days;

  } catch(error) {
    console.log(error)
    return null;
  }
}