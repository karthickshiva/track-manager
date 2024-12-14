import React from 'react';

interface BadgeProps {
  label: string;
  value?: string | number;
}

export function Badge({ label, value }: BadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {value ? `${label}: ${value}` : label}
    </span>
  );
}