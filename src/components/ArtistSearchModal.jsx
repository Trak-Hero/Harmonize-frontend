import { useState } from 'react';
import { useProfileStore } from '../state/profileStore';

const API = import.meta.env.VITE_API_BASE_URL;

export default function ArtistSearchModal({ onClose, userId }) {
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
      const url = `${API}/spotify/search?q=${encodeURIComponent(query)}&type=artist`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      console.log('[ArtistSearchModal] received data:', data);
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[ArtistSearchModal] search failed:', e);
      setError('Could not fetch artists. Check the backend route.');
    } finally {
      setLoading(false);
    }
  };

  const pickArtist = async (artist) => {
    // More robust image extraction
    let displayImage = '';
    
    if (artist.images && Array.isArray(artist.images) && artist.images.length > 0) {
      // Find the best quality image (usually the first one is highest quality)
      const validImage = artist.images.find(img => img.url && img.url.trim());
      displayImage = validImage ? validImage.url.trim() : '';
    } else if (artist.image && typeof artist.image === 'string') {
      displayImage = artist.image.trim();
    }
    
    // Fallback to a default if no image found
    if (!displayImage) {
      console.warn('[ArtistSearchModal] No image found for artist:', artist.name);
    }
  
    const tileData = {
      userId,
      type: 'artist',
      title: artist.name || 'Unknown Artist',
      bgImage: displayImage,
      x: 0,
      y: Infinity,
      w: 2,
      h: 2,
    };
  
    console.log('[pickArtist] Creating tile with data:', tileData);
  
    try {
      await addTile(tileData);
      onClose();
    } catch (error) {
      console.error('[pickArtist] Failed to add artist tile:', error);
      setError('Failed to add artist tile. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 w-full max-w-xl rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Search Artist</h2>

        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded bg-zinc-800 text-white"
            placeholder="Tame Impala, Taylor Swift…"
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
          {results.map((artist) => {
            // Display logic for search results
            let displayImage = 'https://placehold.co/48x48?text=Artist';
            
            if (artist.images && Array.isArray(artist.images) && artist.images.length > 0) {
              const validImage = artist.images.find(img => img.url && img.url.trim());
              if (validImage) displayImage = validImage.url;
            } else if (artist.image && typeof artist.image === 'string' && artist.image.trim()) {
              displayImage = artist.image;
            }

            return (
              <li
                key={artist.id || Math.random()}
                onClick={() => pickArtist(artist)}
                className="flex items-center gap-3 bg-zinc-800 p-3 rounded cursor-pointer hover:bg-zinc-700"
              >
                <img
                  src={displayImage}
                  alt={artist.name || 'Artist'}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/48x48?text=Artist';
                  }}
                />
                <span className="text-white">{artist.name || 'Unknown Artist'}</span>
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