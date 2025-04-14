import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder: string;
  label: string;
  name: string;
  availableDays: number[] | null
}

export default function DateInput({ selectedDate, onChange, label, placeholder, name, availableDays }: DateInputProps) {
  // Helper to fix the timezone by setting time to noon (avoids date shifting)
  const handleDateChange = (date: Date | null) => {
    if (!date) return onChange(null);

    const fixedDate = new Date(date);
    fixedDate.setHours(12, 0, 0, 0); // set to noon to avoid UTC shift
    onChange(fixedDate);
  };

  console.log(availableDays)

  return (
    <div className='input-block margin-bottom-2'>
      <label htmlFor={name} className='block'>{label}</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        filterDate={(date) => availableDays?.includes(date.getDay()) ?? false} // disables days
        placeholderText={placeholder}
        name={name}
        dateFormat="yyyy-MM-dd"
        showTimeSelect={false}
      />
    </div>
  );
}