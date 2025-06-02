// src/components/SongSearchModal.jsx
import { useEffect, useState } from 'react';
import { useProfileStore } from '../state/profileStore';

export default function SongSearchModal({ userId, onClose }) {
  const addTempTile  = useProfileStore((s) => s.addTempTile);
  const setEditorOpen = useProfileStore((s) => s.setEditorOpen);

  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);

  // Fetch Spotify tracks each time query changes:
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/spotify/search?q=${encodeURIComponent(
        query
      )}&type=track`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
        }
      })
      .catch((err) => {
        console.error('[SongSearchModal] error fetching tracks:', err);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  const handleSelect = (track) => {
    // Grab the first album image (if any)
    const albumCoverUrl =
      track.album && Array.isArray(track.album.images) && track.album.images.length > 0
        ? track.album.images[0].url
        : '';

    // ─────────────── IMPORTANT FIX ───────────────
    // Write the cover URL into bgImage (not image) so it persists in Mongo.
    const tempId = addTempTile({
      type:    'song',
      title:   track.name,
      bgImage: albumCoverUrl,
      userId,
      x: 0,
      y: Infinity,
      w: 2,
      h: 1,
    });
    setEditorOpen(true, tempId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60">
      <div className="bg-gray-900 rounded-xl w-full max-w-lg mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Search Songs</h2>
          <button
            onClick={onClose}
            className="text-white px-2 py-1 hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song…"
          className="w-full rounded bg-gray-800 p-2 text-white"
        />

        {loading && <p className="text-white mt-2">Searching…</p>}
        {!loading && results.length === 0 && query && (
          <p className="text-white mt-2">No results found.</p>
        )}

        <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
          {results.map((track) => (
            <div
              key={track.id}
              className="flex flex-col items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => handleSelect(track)}
            >
              <img
                src={
                  track.album?.images?.[0]?.url ||
                  'https://placehold.co/80x80?text=No%20Image'
                }
                alt={track.name}
                className="w-20 h-20 rounded object-cover"
              />
              <p className="mt-2 text-white text-sm text-center">
                {track.name}
              </p>
              <p className="text-gray-400 text-xs text-center mt-1">
                {track.artists?.map((a) => a.name).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
