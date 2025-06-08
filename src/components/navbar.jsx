import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import {
  Compass,
  Users,
  MapTrifold,
  Planet,
  ArrowRight,
  UserCircle,
  SpotifyLogo,
  SignIn,
  SignOut,
  Flask,
} from '@phosphor-icons/react';

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
    { name: "Blend", icon: <Flask size={18} weight="regular" /> },
    { name: "Galaxy", icon: <Planet size={18} weight="regular" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 py-3
      bg-black/30 backdrop-blur-md rounded-b-xl border border-white/10 shadow-md text-white">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Harmonize
        </Link>

        {navItems.map(({ name, icon }) => (
          <Link key={name} to={`/${name.toLowerCase()}`} className={navLinkClasses}>
            <div className="flex items-center gap-1">
              {icon}
              <span className="whitespace-nowrap">{name}</span>
            </div>
            <span className={underlineSpanClasses}></span>
          </Link>
        ))}
      </div>

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

    <div className="flex items-center gap-4">
      {user ? (
        <>
          <Link to="/profile" className={navLinkClasses}>
            <div className="flex items-center gap-1">
              <UserCircle size={18} weight="regular" />
              <span>Profile</span>
            </div>
            <span className={underlineSpanClasses}></span>
          </Link>

          <Link to="/connect" className={navLinkClasses}>
            <div className="flex items-center gap-1 text-green-400 hover:text-green-300">
              <SpotifyLogo size={18} weight="fill" />
              <span>Spotify</span>
            </div>
            <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <button
            onClick={logout}
            className={`${navLinkClasses} text-red-400 hover:text-red-300`}
          >
            <div className="flex items-center gap-1">
              <SignOut size={18} weight="regular" />
              <span>Log out</span>
            </div>
            <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className={navLinkClasses}>
            <div className="flex items-center gap-1">
              <SignIn size={18} weight="regular" />
              <span>Log in</span>
            </div>
            <span className={underlineSpanClasses}></span>
          </Link>

          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Sign up
          </Link>
        </>
      )}
    </div>
    </nav>
  );
}