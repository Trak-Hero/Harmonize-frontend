import { useState } from 'react';
import { useProfileStore } from '../state/profileStore';

const API = import.meta.env.VITE_API_BASE_URL;

export default function SongSearchModal({ onClose, userId }) {
  const addTile = useProfileStore((s) => s.addTile);
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState('');

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError('');
    try {
      const url = `${API}/spotify/search?q=${encodeURIComponent(query)}&type=track`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setResults(data.tracks?.items ?? []);
    } catch (e) {
      console.error('[SongSearchModal] search failed:', e);
      setError('Could not fetch songs.');
    } finally {
      setLoading(false);
    }
  };

  const pickSong = async (track) => {
    const albumCover = track.album?.images?.[0]?.url ?? '';
    await addTile({
      userId,
      type: 'song',
      title: track.name,
      bgImage: albumCover,
      x: 0, y: Infinity, w: 2, h: 2,
    });
    onClose();
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
          <p className="text-white/60">No results yet – try a search.</p>
        )}

        <ul className="max-h-64 overflow-y-auto space-y-2">
          {results.map((t) => (
            <li
              key={t.id}
              onClick={() => pickSong(t)}
              className="flex items-center gap-3 bg-zinc-800 p-3 rounded cursor-pointer hover:bg-zinc-700"
            >
              <img
                src={t.album?.images?.[0]?.url}
                alt={t.name}
                className="w-12 h-12 object-cover rounded"
              />
              <span className="text-white">{t.name}</span>
            </li>
          ))}
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
