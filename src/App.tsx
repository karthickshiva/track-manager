import React, { useEffect, useState } from 'react';
import { Track, TrackFormData } from './types/track';
import { ImportProgress, SpotifyImportOptions } from './types/spotify';
import { trackService } from './services/trackService';
import { spotifyImportService } from './services/spotify/spotifyImportService';
import { useSearch } from './hooks/useSearch';
import { useLoadingState } from './hooks/useLoadingState';
import { Modal } from './components/ui/Modal';
import { TrackForm } from './components/track/TrackForm';
import { ImportForm } from './components/import/ImportForm';
import { ImportProgressBar } from './components/import/ImportProgress';
import { SearchBar } from './components/search/SearchBar';
import { Header } from './components/layout/Header';
import { EmptyState } from './components/layout/EmptyState';
import { TrackListItem } from './components/track/TrackListItem';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
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

  const handleImport = async (options: SpotifyImportOptions) => {
    try {
      await spotifyImportService.importFromSpotify(options, setImportProgress);
      await loadTracks();
      handleCloseImport();
    } catch (error) {
      console.error('Failed to import tracks:', error);
    } finally {
      setImportProgress(null);
    }
  };

  const handleSubmit = async (formData: TrackFormData) => {
    try {
      if (editingTrack) {
        setOperationLoading(editingTrack.id, 'edit', true);
        const updated = await trackService.updateTrack(editingTrack.id, formData);
        setTracks(tracks.map(t => t.id === editingTrack.id ? updated : t));
      } else {
        const newTrack = await trackService.addTrack(formData);
        setTracks([...tracks, newTrack]);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Failed to save track:', error);
    } finally {
      if (editingTrack) {
        setOperationLoading(editingTrack.id, 'edit', false);
      }
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

  const handleCloseImport = () => {
    setIsImportOpen(false);
    setImportProgress(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Header 
          onAddTrack={() => setIsFormOpen(true)} 
          onImport={() => setIsImportOpen(true)} 
        />
        
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search tracks by title, artist, genre, or key..."
        />

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

        {filteredTracks.length === 0 && (
          <EmptyState
            message={searchQuery
              ? 'No tracks found matching your search criteria.'
              : 'No tracks added yet. Click the "Add Track" button to get started!'}
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
            isSubmitting={editingTrack ? isOperationLoading(editingTrack.id, 'edit') : false}
          />
        </Modal>

        <Modal
          isOpen={isImportOpen}
          onClose={handleCloseImport}
          title="Import from Spotify"
        >
          {importProgress ? (
            <ImportProgressBar progress={importProgress} />
          ) : (
            <ImportForm
              onSubmit={handleImport}
              onCancel={handleCloseImport}
              isSubmitting={!!importProgress}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}