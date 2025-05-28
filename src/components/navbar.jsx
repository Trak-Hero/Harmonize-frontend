import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

export default function Navbar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const API = import.meta.env.VITE_API_BASE_URL;

  const search = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
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
        <Link to="/friends" className="nav-link">Friends</Link>
        <Link to="/map" className="nav-link">Map</Link>
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

      {/* Right: Profile + Dashboard + Connect/Spotify */}
      <div className="flex gap-2">
        {user && (
          <>
            <Link to="/profile" className="px-4 py-1 rounded bg-purple-500 hover:bg-purple-600">
              Profile
            </Link>
            <Link to="/dashboard" className="px-4 py-1 rounded bg-blue-500 hover:bg-blue-600">
              Dashboard
            </Link>
            <Link to="/connect" className="px-4 py-1 rounded bg-green-500 hover:bg-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.6 0-.359.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Spotify
            </Link>
            <button
              onClick={logout}
              className="px-4 py-1 rounded bg-red-500 hover:bg-red-600"
            >
              Log out
            </button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className="px-4 py-1 rounded bg-blue-500 hover:bg-blue-600">
              Log in
            </Link>
            <Link to="/register" className="px-4 py-1 rounded bg-green-500 hover:bg-green-600">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}