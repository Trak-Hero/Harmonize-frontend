// src/components/SongSearchModal.jsx
import { useState } from 'react';
import { useProfileStore } from '../state/profileStore';

const API = import.meta.env.VITE_API_BASE_URL;

export default function SongSearchModal({ onClose, userId }) {
  const addTile = useProfileStore((s) => s.addTile);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const search = async () => {
  if (!query.trim()) return;
  setLoading(true); 
  setError('');
  try {
    const url = `${API}/spotify/search?q=${encodeURIComponent(query)}&type=track`;
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    console.log('[SongSearchModal] received data:', data);
    
    let tracks = [];
    if (data.tracks && Array.isArray(data.tracks)) {
      tracks = data.tracks; 
    } else if (Array.isArray(data)) {
      tracks = data; 
    }
    
    setResults(tracks);
  } catch (e) {
    console.error('[SongSearchModal] search failed:', e);
    setError('Could not fetch songs.');
  } finally {
    setLoading(false);
  }
};

  const pickSong = async (track) => {
    // Extract album cover art
    let albumCover = '';
    
    if (track.album && track.album.images && Array.isArray(track.album.images) && track.album.images.length > 0) {
      // Sort by size and get the best quality image
      const sortedImages = track.album.images.sort((a, b) => (b.width || 0) - (a.width || 0));
      albumCover = sortedImages[0].url;
    } else if (track.album && track.album.image && typeof track.album.image === 'string') {
      albumCover = track.album.image;
    }
    
    console.log('[pickSong] Using album cover:', albumCover);
  
    const tileData = {
      userId,
      type: 'song',
      title: track.name || 'Unknown Song',
      bgImage: albumCover, // This will be used by the Tile component
      x: 0,
      y: Infinity,
      w: 2,
      h: 2,
    };
  
    console.log('[pickSong] Creating tile with data:', tileData);
  
    try {
      await addTile(tileData);
      onClose();
    } catch (error) {
      console.error('[pickSong] Failed to add song tile:', error);
      setError('Failed to add song tile. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 w-full max-w-xl rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Search Song</h2>

        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded bg-zinc-800 text-white"
            placeholder="Bohemian Rhapsody, Bad Habits…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <button onClick={search} className="px-4 py-2 bg-blue-500 rounded text-white">
            Search
          </button>
        </div>

        {loading && <p className="text-white">Searching…</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !results.length && !error && (
          <p className="text-white/60">No results yet – try a search.</p>
        )}

        <ul className="max-h-64 overflow-y-auto space-y-2">
          {results.map((track) => {
            // Display logic for search results preview
            let displayImage = 'https://placehold.co/48x48?text=Song';
            
            if (track.album && track.album.images && Array.isArray(track.album.images) && track.album.images.length > 0) {
              displayImage = track.album.images[0].url;
            } else if (track.album && track.album.image && typeof track.album.image === 'string') {
              displayImage = track.album.image;
            }
            
            return (
              <li
                key={track.id || Math.random()}
                onClick={() => pickSong(track)}
                className="flex items-center gap-3 bg-zinc-800 p-3 rounded cursor-pointer hover:bg-zinc-700"
              >
                <img
                  src={displayImage}
                  alt={track.name || 'Song'}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/48x48?text=Song';
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-white font-medium">{track.name || 'Unknown Song'}</span>
                  <span className="text-gray-400 text-sm">
                    {track.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="text-right">
          <button onClick={onClose} className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}