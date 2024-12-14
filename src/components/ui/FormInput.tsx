import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function FormInput({ className = '', ...props }: FormInputProps) {
  return (
    <input
      {...props}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-2 ${className}`}
    />
  );
}