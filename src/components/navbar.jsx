import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Users, MapTrifold, ArrowRight } from '@phosphor-icons/react';

export default function Navbar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const search = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
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

      {/* Right: Profile + Dashboard + Connect */}
      <div className="flex gap-3">
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
          className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-sm font-medium transition"
        >
        Sign up
        </Link>
      </div>
    </nav>
  );
}
