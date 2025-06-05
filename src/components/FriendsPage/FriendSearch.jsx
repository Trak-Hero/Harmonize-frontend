import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFriendStore from '../state/friendStore';

const API = import.meta.env.VITE_API_BASE_URL;

export default function FriendSearch({ onClose }) {
  const navigate = useNavigate();
  const { addFriendToStore } = useFriendStore();

  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  /* ───────── Search users ───────── */
  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError('');

    try {
      const url  = `${API}/api/users/search?q=${encodeURIComponent(query)}`;
      const res  = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();               // [{ _id, username, displayName, avatar }]
      setResults(data);
    } catch (e) {
      console.error('[FriendSearchModal] search failed:', e);
      setError('Could not fetch users.');
    } finally {
      setLoading(false);
    }
  };

  /* ───────── Select friend ───────── */
  const pickFriend = (user) => {
    addFriendToStore(user);                        // keep a local cache
    navigate(`/friends/${user._id}`);              // go to FriendProfile
    onClose();
  };

  /* ───────── Render ───────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 w-full max-w-xl rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Find Friends</h2>

        {/* input + button */}
        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded bg-zinc-800 text-white"
            placeholder="Search by username…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <button
            onClick={search}
            className="px-4 py-2 bg-blue-500 rounded text-white"
          >
            Search
          </button>
        </div>

        {/* status messages */}
        {loading && <p className="text-white">Searching…</p>}
        {error   && <p className="text-red-400">{error}</p>}
        {!loading && !results.length && !error && (
          <p className="text-white/60">No results yet – try a search.</p>
        )}

        {/* results */}
        <ul className="max-h-64 overflow-y-auto space-y-2">
          {results.map((u) => (
            <li
              key={u._id}
              onClick={() => pickFriend(u)}
              className="flex items-center gap-3 bg-zinc-800 p-3 rounded cursor-pointer hover:bg-zinc-700"
            >
              <img
                src={u.avatar || 'https://placehold.co/48x48?text=User'}
                alt={u.username}
                className="w-12 h-12 object-cover rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-white font-medium">
                  {u.displayName || u.username}
                </span>
                <span className="text-gray-400 text-sm">@{u.username}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* footer */}
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
