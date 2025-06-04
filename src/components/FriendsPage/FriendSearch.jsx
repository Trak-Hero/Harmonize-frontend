import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FriendSearch() {
  const [term, setTerm]       = useState('');
  const [results, setResults] = useState([]);
  const timer                 = useRef(null);
  const navigate              = useNavigate();

  /* ---------- debounced fetch ---------- */
  useEffect(() => {
    if (!term.trim()) { setResults([]); return; }

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/search?username=${encodeURIComponent(term)}`,
        { credentials: 'include' }
      )
        .then((r) => r.json())
        .then((data) => setResults(Array.isArray(data) ? data : []))
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timer.current);
  }, [term]);

  const hasResults = Boolean(results[0]);

  return (
    <div className="w-full mb-6">
      <input
        className="w-full border rounded-md p-2"
        placeholder="Search by username…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />

      {hasResults && (
        <ul className="mt-2 max-h-60 overflow-y-auto border rounded-md bg-white shadow">
          {results.map((u) => (
            <li
              key={u._id}
              onClick={() => navigate(`/friends/${u._id}`)}
              className="text-left flex-1 truncate text-gray-800"
            >
              {u.username || 'Unknown'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
