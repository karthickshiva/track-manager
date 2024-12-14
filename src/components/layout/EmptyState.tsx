import React from 'react';
import { Music } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <Music className="text-gray-400" size={48} />
      </div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}