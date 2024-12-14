import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
}

export function FormSelect({ options, className = '', ...props }: FormSelectProps) {
  return (
    <select
      {...props}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-2 ${className}`}
    >
      <option value="">Select...</option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}