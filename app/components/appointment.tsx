'use client';

/*
    Bugs:
        Fix initial doctor
        Fix doctor change & date change
        Fix to fetch right time slots for a certain doctor & date, excluding the slots already taken

        Form states
            Input: empty, typing
            Button: submitting
            Successful network response: success
            Failed network response: Error

*/

import { useState, useEffect, useActionState, useRef } from "react";
import Input from "./input";
import DateInput from "./dateInput";
import { fetchDoctorNames } from "../dashboard/lib/data";
import { useUser } from "../dashboard/lib/userContext";
import { AppointmentState, createAppointment, getDoctorInfo, generateTimeSlots, getAvailableDays } from "../dashboard/lib/actions";
import { DoctorType } from "@/types";

export default function Appointment() {
    const [doctors, setDoctors] = useState<DoctorType[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    const [timeSlots, setTimeSlots] = useState<string[][]>([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [availableDays, setAvailableDays] = useState<number[] | null>([]);
    const { user } = useUser();

    //let selectedDoctorIndex: number;
    /*
        Doctor state
        roomNumber
        availableFrom
        availableUntil
        availableDates (update getter funtion)

        Doctor and Date state
        timeSlots
    */

    const roomNumber = useRef(0);
    const availableFrom = useRef('');
    const availableUntil = useRef('');

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
  
    useEffect(() => {
        if (selectedDoctorId) {
            const fetchDoctor = async () => {
                try {
                    if (selectedDoctorId != "") {
                        const doctorInfo = await getDoctorInfo(selectedDoctorId);
                        if (doctorInfo !== null) {
                            if (doctorInfo.room_number != undefined) roomNumber.current = doctorInfo.room_number;
                            if (doctorInfo.available_from != undefined) availableFrom.current = doctorInfo.available_from;
                            if (doctorInfo.available_until != undefined) availableUntil.current = doctorInfo.available_until;
                        }
                    }
                } catch (error) {
                    console.error('Error fetching doctor information:', error);
                }
            };
            
            const fetchTimeSlots = async () => {
                try {
                    if (selectedDoctorId != "") {
                        const { rawTimes, formattedTimes } = await generateTimeSlots(selectedDoctorId, selectedDate, availableFrom.current, availableUntil.current, 30);
                        if (rawTimes !== null) {
                            const newTimeSlots = rawTimes.map((time, i) => [time, formattedTimes[i]]);
                            setTimeSlots(newTimeSlots);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching time slots:', error);
                }
            };
            
            const fetchAvailableDays = async () => {
                if (selectedDoctorId != "") {
                    const fetchedAvailableDays = await getAvailableDays(selectedDoctorId);
                    if (fetchAvailableDays !== null) {
                        setAvailableDays(fetchedAvailableDays);
                    }
                }
            }

            fetchDoctor();
            fetchAvailableDays();
            fetchTimeSlots();
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, selectedDoctorId]);

    const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
         setSelectedDoctorId(e.target.value);
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
                <select name="doctor_id" id="doctors" onChange={handleDoctorChange}>
                    {
                        doctors.map(doctor => {
                            return <option key={doctor.id} value={doctor.id}>Dr. {doctor.name}</option>
                        })
                    }
                </select>
            </div>
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
            <Input name="appointment_queue_number" type="hidden" value={`700JS${roomNumber.current}`} />
            <button type="submit" className="primary-btn">Request Appointment</button>
        </form>
    );
}