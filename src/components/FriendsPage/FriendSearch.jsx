import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FriendSearch() {
  const [term,    setTerm]    = useState('');
  const [results, setResults] = useState([]);
  const timer                 = useRef(null);
  const navigate              = useNavigate();

  /* ───────── debounce search ───────── */
  useEffect(() => {
    if (!term.trim()) { setResults([]); return; }

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetch(`/api/users/search?q=${encodeURIComponent(term)}`, { credentials: 'include', })
        .then((r) => r.json())
        .then((data) => setResults(Array.isArray(data) ? data : []))
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timer.current);
  }, [term]);

  return (
    <div className="w-full mb-6">
      <input
        className="w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none"
        placeholder="Search users…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />

      {!!results.length && (
        <ul className="mt-2 max-h-60 overflow-y-auto border rounded-md bg-white shadow">
          {results.map((u) => (
            <li
              key={u._id}
              onClick={() => {
                navigate(`/friends/${u._id}`);
                setTerm('');
                setResults([]);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex-1 truncate text-gray-800"
            >
              {u.username || 'Unknown'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
