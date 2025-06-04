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
      const url = `${API_BASE}/api/users/search?q=${encodeURIComponent(query)}`;
      console.log('🔍 Fetching users from:', url);
      
      const res = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
      }
      
      const userData = await res.json();
      console.log('✅ Users data received:', userData);
      setUsers(userData);
    } catch (err) {
      console.error('❌ Failed to search users:', err);
      setError(`Failed to load users: ${err.message}`);
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

  const handleUserSelect = (user) => {
    console.log('🎯 User selected in modal:', user);
    onSelectUser(user);
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

          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className="flex items-center gap-3 bg-zinc-800 p-3 rounded cursor-pointer hover:bg-zinc-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {user.displayName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="text-white font-medium">
                  {user.displayName || user.username}
                </div>
                {user.displayName && user.username && (
                  <div className="text-gray-400 text-sm">@{user.username}</div>
                )}
              </div>
            </div>
          ))}
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