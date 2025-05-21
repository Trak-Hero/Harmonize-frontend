import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const [q, setQ] = useState('');
  const navigate  = useNavigate();

  const search = e => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ('');
  };

  return (
    <nav className="w-full flex items-center gap-4 px-6 py-3 bg-black/60 backdrop-blur text-white">
      <Link to="/" className="text-2xl font-bold tracking-wide">Reverberate</Link>

      <form onSubmit={search} className="ml-auto flex">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          className="px-3 py-1 rounded-l bg-gray-800 placeholder-gray-400 w-56 focus:outline-none"
          placeholder="Search artists"
        />
        <button className="px-4 py-1 rounded-r bg-blue-500 hover:bg-blue-600">
          Search
        </button>
      </form>
    </nav>
  );
}
