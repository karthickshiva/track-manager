import React, { useEffect, useState } from 'react';
import { Track, TrackFormData } from './types/track';
import { trackService } from './services/trackService';
import { TrackListItem } from './components/track/TrackListItem';
import { TrackForm } from './components/track/TrackForm';
import { SearchBar } from './components/search/SearchBar';
import { Header } from './components/layout/Header';
import { EmptyState } from './components/layout/EmptyState';
import { Modal } from './components/ui/Modal';
import { useSearch } from './hooks/useSearch';
import { useLoadingState } from './hooks/useLoadingState';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const { searchQuery, setSearchQuery, filteredTracks } = useSearch(tracks);
  const { setLoading: setOperationLoading, isLoading: isOperationLoading } = useLoadingState();

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const data = await trackService.getTracks();
      setTracks(data);
    } catch (error) {
      console.error('Failed to load tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: TrackFormData) => {
    const operationId = editingTrack?.id || 'new';
    const operationType = editingTrack ? 'edit' : 'add';

    try {
      setOperationLoading(operationId, operationType, true);

      if (editingTrack) {
        const updated = await trackService.updateTrack(editingTrack.id, formData);
        setTracks(tracks.map(t => t.id === editingTrack.id ? updated : t));
      } else {
        const newTrack = await trackService.addTrack(formData);
        setTracks([newTrack, ...tracks]);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Failed to save track:', error);
    } finally {
      setOperationLoading(operationId, operationType, false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this track?')) return;
    
    try {
      setOperationLoading(id, 'delete', true);
      await trackService.deleteTrack(id);
      setTracks(tracks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete track:', error);
    } finally {
      setOperationLoading(id, 'delete', false);
    }
  };

  const handleEdit = (track: Track) => {
    setEditingTrack(track);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTrack(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Header onAddTrack={() => setIsFormOpen(true)} />
        
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, artist, genre, or key..."
        />

        {filteredTracks.length > 0 ? (
          <div className="space-y-4">
            {filteredTracks.map(track => (
              <TrackListItem
                key={track.id}
                track={track}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isEditing={isOperationLoading(track.id, 'edit')}
                isDeleting={isOperationLoading(track.id, 'delete')}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message={
              searchQuery
                ? 'No tracks found matching your search criteria.'
                : 'No tracks added yet. Click the "Add Track" button to get started!'
            }
          />
        )}

        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingTrack ? 'Edit Track' : 'Add New Track'}
        >
          <TrackForm
            initialData={editingTrack || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            isSubmitting={isOperationLoading(editingTrack?.id || 'new', editingTrack ? 'edit' : 'add')}
          />
        </Modal>
      </div>
    </div>
  );
}