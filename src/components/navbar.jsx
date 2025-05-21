import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const search = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ('');
  };

  return (
    <nav className="w-full flex items-center justify-between gap-4 px-6 py-3 bg-black/60 backdrop-blur text-white">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Reverberate
        </Link>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/discover" className="nav-link">Discover</Link>
      </div>

      {/* Center: Search */}
      <form onSubmit={search} className="flex">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="px-3 py-1 rounded-l bg-gray-800 placeholder-gray-400 text-white w-56 focus:outline-none"
          placeholder="Search artists, songs, or events"
        />
        <button className="px-4 py-1 rounded-r bg-blue-500 hover:bg-blue-600">
          Search
        </button>
      </form>

      {/* Right: Profile + Dashboard + Connect */}
      <div className="flex gap-2">
        <Link to="/profile" className="px-4 py-1 rounded bg-purple-500 hover:bg-purple-600">
          Profile
        </Link>
        <Link to="/dashboard" className="px-4 py-1 rounded bg-blue-500 hover:bg-blue-600">
          Dashboard
        </Link>
        <Link to="/connect" className="px-4 py-1 rounded bg-green-500 hover:bg-green-600">
          Sign up
        </Link>
      </div>
    </nav>
  );
}
