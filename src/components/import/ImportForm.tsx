import React, { useState } from 'react';
import { SpotifyImportOptions } from '../../types/spotify';
import { FormField } from '../ui/FormField';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { FormActions } from '../ui/FormActions';

interface ImportFormProps {
  onSubmit: (options: SpotifyImportOptions) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ImportForm({ onSubmit, onCancel, isSubmitting }: ImportFormProps) {
  const [formData, setFormData] = useState<SpotifyImportOptions>({
    type: 'album',
    url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Import Type">
        <FormSelect
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={[
            { value: 'album', label: 'Album' },
            { value: 'artist', label: 'Artist' }
          ]}
          required
        />
      </FormField>

      <FormField label="Spotify URL">
        <FormInput
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder={formData.type === 'album' 
            ? "https://open.spotify.com/album/..." 
            : "https://open.spotify.com/artist/..."}
          required
        />
      </FormField>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        submitLabel={isSubmitting ? 'Importing...' : 'Start Import'}
      />
    </form>
  );
}