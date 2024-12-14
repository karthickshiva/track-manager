import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface TrackActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  isDeleting: boolean;
}

export function TrackActions({
  onEdit,
  onDelete,
  isEditing,
  isDeleting
}: TrackActionsProps) {
  return (
    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
      <button
        onClick={onEdit}
        disabled={isEditing || isDeleting}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors 
          disabled:opacity-50 disabled:cursor-not-allowed"
        title="Edit track"
      >
        {isEditing ? (
          <LoadingSpinner size={18} className="text-blue-600" />
        ) : (
          <Edit2 size={18} />
        )}
      </button>
      <button
        onClick={onDelete}
        disabled={isEditing || isDeleting}
        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors 
          disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete track"
      >
        {isDeleting ? (
          <LoadingSpinner size={18} className="text-red-600" />
        ) : (
          <Trash2 size={18} />
        )}
      </button>
    </div>
  );
}