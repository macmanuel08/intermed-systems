'use client';

import { useState, useEffect, useActionState } from "react";
import Input from "./input";
import DateInput from "./dateInput";
import { fetchDoctorNames } from "../dashboard/lib/data";
import { useUser } from "../dashboard/lib/userContext";
import { createAppointment, getDoctorInfo, generateTimeSlots, getAvailableDays } from "../dashboard/lib/actions";
import { AppointmentState } from "../dashboard/lib/actions";
import { DoctorType } from "@/types";

export default function Appointment() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [doctors, setDoctors] = useState<DoctorType[]>([]);
    const [selectedDoctorIndex, setSelectedDoctorIndex] = useState<number>();
    const [roomNumber, setRoomNumber] = useState(0);
    const [availableFrom, setAvailableFrom] = useState('');
    const [availableUntil, setAvailableUntil] = useState('');
    const [timeSlots, setTimeSlots] = useState<string[][]>([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [availableDays, setAvailableDays] = useState<number[] | null>([]);
    const { user } = useUser();

    const initialState: AppointmentState = { message: null, errors: {} };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, formAction] = useActionState( createAppointment, initialState);

    useEffect(() => {
        async function fetchDoctors() {
            const doctorsName = await fetchDoctorNames();
            setDoctors(doctorsName as DoctorType[]);
        }
        fetchDoctors();
    },[]);

    const selectedDoctorId =
    typeof selectedDoctorIndex === 'number'
      ? doctors[selectedDoctorIndex]?.id
      : null;
  
    useEffect(() => {
        if (selectedDoctorId) {
            const fetchDoctor = async () => {
                try {
                    const doctorInfo = await getDoctorInfo(selectedDoctorId);
                    if (doctorInfo !== null) {
                        setRoomNumber(doctorInfo.room_number || 0);
                        setAvailableFrom(doctorInfo.available_from || '');
                        setAvailableUntil(doctorInfo.available_until || '');
                    }
                } catch (error) {
                    console.error('Error fetching doctor information:', error);
                }
            };
            
            const fetchTimeSlots = async () => {
                try {
                    const { rawTimes, formattedTimes } = await generateTimeSlots(selectedDoctorId, selectedDate, availableFrom, availableUntil, 30);
                    if (rawTimes !== null) {
                        const newTimeSlots = rawTimes.map((time, i) => [time, formattedTimes[i]]);
                        setTimeSlots(newTimeSlots);
                    }
                } catch (error) {
                    console.error('Error fetching time slots:', error);
                }
            };
            
            const fetchAvailableDays = async () => {
                const fetchedAvailableDays = await getAvailableDays(selectedDoctorId);
                if (fetchAvailableDays !== null) {
                    setAvailableDays(fetchedAvailableDays);
                }
            }

            fetchDoctor();
            fetchAvailableDays();
            fetchTimeSlots();
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDoctorId]);

    const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = doctors.findIndex(doctor => doctor.name === e.target.value);
        setSelectedDoctorIndex(index);
    }

    const handleTimeChange = (e: React.MouseEvent<HTMLElement>) => {
        const time = (e.currentTarget as HTMLDivElement).dataset.value;
        if (time) setSelectedTime(time);
        document.querySelector('.time-slots .active')?.classList.remove('active');
        (e.currentTarget as HTMLDivElement).classList.add('active');

    }
    
    return (
        <form action={formAction}>
            <Input name="user_id" type="hidden" value={user?.userId} />
            <div className='input-block margin-bottom-2'>
                <label htmlFor="doctors" className='block'>Select A Doctor</label>
                <select name="doctors" id="doctors" onChange={handleDoctorChange}>
                    {
                        doctors.map(doctor => {
                            return <option key={doctor.id} value={doctor.name}>Dr. {doctor.name}</option>
                        })
                    }
                </select>
            </div>
            {
                typeof selectedDoctorIndex === 'number' && <Input type="hidden" name="doctor_id" value={doctors[selectedDoctorIndex].id} />
            }
            <DateInput selectedDate={selectedDate} availableDays={availableDays} onChange={setSelectedDate} name="date" label="Date" placeholder="Select A Date" />
            {
                typeof selectedDoctorId != null && selectedDate != null && <Input name="time" type="hidden" label="Select Time" value={selectedTime} placeholder="Select Time" />
            }
            <div className="time-slots margin-bottom-2">
            {timeSlots.length > 0 && selectedDate != null && timeSlots.map(timeSlot => (
                <div onClick={handleTimeChange} key={timeSlot[0]} data-value={timeSlot[0]}>
                    {timeSlot[1]}
                </div>
            ))}
            </div>
            <div className='input-block margin-bottom-2'>
                <label htmlFor="description" className='block'>Additional Notes</label>
                <textarea name="description" id="description" placeholder="Additional Notes about the appoinment."></textarea>
            </div>
            <Input name="status" type="hidden" value="Pending" />
            <Input name="appointment_queue_number" type="hidden" value={`700JS${roomNumber}`} />
            <button type="submit" className="primary-btn">Request Appointment</button>
        </form>
    );
}