'use client';

import { ChangeEvent } from 'react';

interface InputProps {
  type: string;
  label: string;
  name: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function Input({ type, label, name, value, onChange, placeholder }: InputProps) {
  return (
    <div className='input-block margin-bottom-2'>
      <label htmlFor={name} className='block'>{label}</label>
      <input 
        type={type} 
        name={name} 
        id={name} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
      />
    </div>
  );
}