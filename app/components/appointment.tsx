'use client';

import { useState, useEffect, useActionState, useRef } from "react";
import Input from "./input";
import DateInput from "./dateInput";
import { fetchDoctorNames } from "../dashboard/lib/data";
import { useUser } from "../dashboard/lib/userContext";
import { AppointmentState, createAppointment, getDoctorInfo, generateTimeSlots, getAvailableDays } from "../dashboard/lib/actions";
import { DoctorType } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

export default function Appointment() {
    const [doctors, setDoctors] = useState<DoctorType[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [timeSlots, setTimeSlots] = useState<string[][]>([]);
    const [selectedTime, setSelectedTime] = useState('');
    const { user } = useUser();

    const roomNumber = useRef(0);
    const availableFrom = useRef('');
    const availableUntil = useRef('');
    const availableDays = useRef<number[] | null>([])

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
            setSelectedDate(null);
            fetchDoctor();
        }
    }, [selectedDoctorId]);

    useEffect(() => {
        if (selectedDoctorId) {
            
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
                        availableDays.current = fetchedAvailableDays;
                    }
                }
            }
            
            fetchAvailableDays();
            fetchTimeSlots();
        }
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
            <AnimatePresence>
                {
                    typeof availableDays != null && selectedDoctorId != "" && (
                        <motion.div
                        key="dateinput"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        >
                            <DateInput selectedDate={selectedDate} availableDays={availableDays.current} onChange={setSelectedDate} name="date" label="Date" placeholder="Select A Date" />
                        </motion.div>
                    ) 
                }
            </AnimatePresence>
            <AnimatePresence>
                {
                    typeof selectedDoctorId != null && selectedDate != null && (
                        <motion.div
                            key="dateinput"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Input name="time" type="hidden" label="Select Time" value={selectedTime} placeholder="Select Time: If your desired timeslot is not listed, please try different date." />
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
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </form>
    );
}