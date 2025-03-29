'use client';

import { useState, useEffect } from "react";
//import Input from "./input";
import DateInput from "./dateInput";

export default function Appointment() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        console.log(selectedDate);
    },[selectedDate]);
    
    return (
        <div>
            <DateInput selectedDate={selectedDate} onChange={setSelectedDate} />
        </div>
    )
}