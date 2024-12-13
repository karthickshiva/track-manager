import React, { useEffect, useState } from 'react';
import { Track, TrackFormData } from './types/track';
import { trackService } from './services/trackService';
import TrackCard from './components/TrackCard';
import TrackForm from './components/TrackForm';
import SearchBar from './components/SearchBar';
import { useSearch } from './hooks/useSearch';
import { Plus } from 'lucide-react';

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const { searchQuery, setSearchQuery, filteredTracks } = useSearch(tracks);

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
    try {
      if (editingTrack) {
        const updated = await trackService.updateTrack(editingTrack.id, formData);
        setTracks(tracks.map(t => t.id === editingTrack.id ? updated : t));
      } else {
        const newTrack = await trackService.addTrack(formData);
        setTracks([...tracks, newTrack]);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Failed to save track:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this track?')) return;
    
    try {
      await trackService.deleteTrack(id);
      setTracks(tracks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete track:', error);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Track Manager</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add Track
          </button>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map(track => (
            <TrackCard
              key={track.id}
              track={track}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">
                {editingTrack ? 'Edit Track' : 'Add New Track'}
              </h2>
              <TrackForm
                initialData={editingTrack || undefined}
                onSubmit={handleSubmit}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        )}

        {filteredTracks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? 'No tracks found matching your search criteria.'
                : 'No tracks added yet. Click the "Add Track" button to get started!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;