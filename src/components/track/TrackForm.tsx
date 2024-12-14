import React from 'react';
import { TrackFormData } from '../../types/track';
import { musicalKeys, timeSignatures, genres } from '../../data/constants';
import { getSpotifyEmbedUrl } from '../../services/spotify/spotifyUtils';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { FormField } from '../ui/FormField';
import { FormSelect } from '../ui/FormSelect';
import { FormInput } from '../ui/FormInput';
import { FormActions } from '../ui/FormActions';

interface TrackFormProps {
  initialData?: TrackFormData;
  onSubmit: (data: TrackFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TrackForm({ initialData, onSubmit, onCancel, isSubmitting = false }: TrackFormProps) {
  const [formData, setFormData] = React.useState<TrackFormData>(
    initialData || {
      spotifyUrl: '',
      youtubeUrl: '',
      key: 'C',
      timeSignature: '4/4',
      genre: 'Pop',
      tempo: 120
    }
  );

  const spotifyEmbedUrl = formData.spotifyUrl ? getSpotifyEmbedUrl(formData.spotifyUrl) : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tempo' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Spotify URL">
        <FormInput
          type="url"
          name="spotifyUrl"
          value={formData.spotifyUrl}
          onChange={handleChange}
          placeholder="https://open.spotify.com/track/..."
          required
        />
      </FormField>

      <FormField label="YouTube URL (Optional)">
        <FormInput
          type="url"
          name="youtubeUrl"
          value={formData.youtubeUrl || ''}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </FormField>

      {spotifyEmbedUrl && (
        <div className="mb-4">
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height="80"
            allow="encrypted-media"
            className="rounded-md"
            title="Spotify Player"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Key">
          <FormSelect
            name="key"
            value={formData.key}
            onChange={handleChange}
            options={musicalKeys.map(key => ({ value: key, label: key }))}
            required
          />
        </FormField>

        <FormField label="Time Signature">
          <FormSelect
            name="timeSignature"
            value={formData.timeSignature}
            onChange={handleChange}
            options={timeSignatures.map(ts => ({ value: ts, label: ts }))}
            required
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Genre">
          <FormSelect
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            options={genres.map(genre => ({ value: genre, label: genre }))}
            required
          />
        </FormField>

        <FormField label="Tempo (BPM)">
          <FormInput
            type="number"
            name="tempo"
            value={formData.tempo}
            onChange={handleChange}
            min={1}
            max={300}
            required
          />
        </FormField>
      </div>

      <FormActions
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        submitLabel={isSubmitting ? 'Saving...' : 'Save'}
      />
    </form>
  );
}