import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function FormActions({ 
  onCancel, 
  isSubmitting = false, 
  submitLabel = 'Save' 
}: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
          border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 
          disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center px-4 py-2 text-sm font-medium 
          text-white bg-indigo-600 border border-transparent rounded-md 
          hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting && <LoadingSpinner size={16} className="mr-2" />}
        {submitLabel}
      </button>
    </div>
  );
}