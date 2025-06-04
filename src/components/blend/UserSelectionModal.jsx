import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function UserSelectionModal({ onClose, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 w-full max-w-md rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Select User to Blend With</h2>

        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded bg-zinc-800 text-white placeholder-gray-400"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch} 
            className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-white">Loading users...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="max-h-64 overflow-y-auto space-y-2">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => onSelectUser(user)}
              className="flex items-center gap-3 bg-zinc-800 p-3 rounded cursor-pointer hover:bg-zinc-700"
            >
              <img
                src={user.avatar || 'https://placehold.co/40x40?text=User'}
                alt={user.displayName}
                className="w-10 h-10 object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/40x40?text=User';
                }}
              />
              <div>
                <div className="text-white font-medium">{user.displayName}</div>
                <div className="text-gray-400 text-sm">@{user.username}</div>
              </div>
            </div>
          ))}
        </div>

        {!loading && users.length === 0 && !error && (
          <p className="text-white/60 text-center">No users found</p>
        )}

        <div className="text-right">
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