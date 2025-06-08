import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function UserSelectionModal({ onClose, onSelectUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchUsers = async (query = '') => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/spotify/friends/top`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

      const { friends } = await res.json();
      const filtered = friends.filter(entry => {
        const name = entry.friend?.name || '';
        return name.toLowerCase().includes(query.toLowerCase());
      });


      setUsers(filtered);
    } catch (err) {
      console.error('❌ Failed to load friends:', err);
      setError(`Failed to load friends: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    searchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchUsers(searchQuery);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-xl p-6 space-y-4 max-h-[80vh] overflow-hidden flex flex-col">
        <h2 className="text-2xl font-bold text-white">Select User to Blend With</h2>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-white">Loading users...</p>}
        {error && (
          <div className="text-red-400 text-sm">
            <p>{error}</p>
            <p className="mt-2 text-xs">
              Frontend: {window.location.origin}<br/>
              API: {API_BASE}
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {!loading && users.length === 0 && !error && (
            <p className="text-white/60">No users found. Try a different search.</p>
          )}

          {users.map((entry) => {
            const user = entry.friend;
            return (
              <div
                key={user.id}
                onClick={() => onSelectUser(user)}
                className="flex items-center gap-3 bg-zinc-800 p-3 rounded cursor-pointer hover:bg-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div className="text-white font-medium">{user.name}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-right pt-4 border-t border-zinc-700">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}