import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFriendStore from '../../state/friendStore';

export default function FriendSearch() {
  const [term, setTerm]     = useState('');
  const [results, setResults] = useState([]);
  const timer                = useRef(null);
  const navigate             = useNavigate();

  const followUser = useFriendStore((s) => s.userSlice.followUser);

  useEffect(() => {
    if (!term.trim()) { setResults([]); return; }

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/search?username=${encodeURIComponent(term)}`,
        { credentials: 'include' }
      )
        .then((r) => r.json())
        .then(setResults)
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timer.current);
  }, [term]);

  return (
    <div className="w-full mb-6">
      <input
        className="w-full border rounded-md p-2"
        placeholder="Search by username…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />

      {results.length > 0 && (
        <ul className="mt-2 max-h-60 overflow-y-auto border rounded-md bg-white shadow">
          {results.map((u) => (
            <li
              key={u._id}
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
            >
              <button
                onClick={() => navigate(`/friends/${u._id}`)}
                className="text-left flex-1 truncate"
              >
                {u.username}
              </button>

              <button
                onClick={() => followUser(u._id)}
                className="ml-3 text-sm text-blue-600 hover:underline"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
