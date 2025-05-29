import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import { Compass, Users, MapTrifold, ArrowRight } from '@phosphor-icons/react';

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

  const navLinkClasses =
    "relative group text-base font-semibold text-gray-300 hover:text-blue-400 transition-colors duration-200";

  const underlineSpanClasses =
    "absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-400 transition-all duration-300 group-hover:w-full";

  const navItems = [
    { name: "Discover", icon: <Compass size={18} weight="regular" /> },
    { name: "Friends", icon: <Users size={18} weight="regular" /> },
    { name: "Map", icon: <MapTrifold size={18} weight="regular" /> },
  ];

  return (
    <nav className="w-full flex items-center justify-between gap-4 px-6 py-3 bg-black/60 backdrop-blur text-white">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Harmonize
        </Link>

        {navItems.map(({ name, icon }) => (
      <Link key={name} to={`/${name.toLowerCase()}`} className={navLinkClasses}>
        <div className="flex items-center gap-1">
          {icon}
          <span>{name}</span>
        </div>
        <span className={underlineSpanClasses}></span>
      </Link>
        ))}
      </div>

      {/* Center: Search */}
      <form onSubmit={search} className="relative w-64">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full px-4 py-2 pr-10 rounded-full bg-black/60 text-white placeholder-gray-400 text-sm
          border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition duration-200"
          placeholder="Search artists, songs, or events"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
        >
          <ArrowRight size={16} weight="bold" />
        </button>
      </form>

    {/* Right: Profile + Dashboard + Connect/Spotify */}
    <div className="flex gap-3">
      {user ? (
        <>
          <Link
            to="/profile"
            className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 text-sm font-medium transition"
          >
            Profile
          </Link>

          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 text-sm font-medium transition"
          >
            Dashboard
          </Link>

          <Link
            to="/connect"
            className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-sm font-medium flex items-center gap-1 transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.6 0-.359.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Spotify
          </Link>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-sm font-medium transition"
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 text-sm font-medium transition"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-sm font-medium transition"
          >
            Sign up
          </Link>
        </>
      )}
    </div>

    </nav>
  );
}