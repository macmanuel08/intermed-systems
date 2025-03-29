import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}

export default function DateInput({ selectedDate, onChange }: DateInputProps) {
  return <DatePicker selected={selectedDate} onChange={onChange} filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} placeholderText="Select A Date" />;
}