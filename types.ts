export type User = {
    id: string,
    userId?: string;
    username: string,
    email: string,
    password: string,
    name: string,
    profile_img: string,
    role: string,
    phone_number: string,
    dob: string
}

export type AppointmentField = {
    user_id: string,
    doctor_id: string,
    date: string,
    time: string,
    description: string,
    status: string,
    appointment_queue_number: string,
}

export type DoctorType = {
    name?: string;
    id?: string;
    room_number?: number;
    available_from?: string;
    available_until?: string;
    available_days?: number[];
    specialty?: string;
    subspecialty?: string;
    initials?: string;
}