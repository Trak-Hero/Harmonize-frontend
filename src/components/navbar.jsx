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

  const navLinkClasses =
    "relative group text-base font-semibold text-gray-300 hover:text-blue-400 transition-colors duration-200";

  const underlineSpanClasses =
    "absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-400 transition-all duration-300 group-hover:w-full";

  return (
    <nav className="w-full flex items-center justify-between gap-4 px-6 py-3 bg-zinc-900/70 backdrop-blur text-white">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Harmonize
        </Link>

        {["Discover", "Friends", "Map"].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className={navLinkClasses}
          >
          {item}
          <span className={underlineSpanClasses}></span>
          </Link>
        ))}
      </div>

      {/* Center: Search */}
      <form onSubmit={search} className="flex">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="px-4 py-2 rounded-l-md bg-zinc-800 text-white placeholder-gray-400 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search artists, songs, or events"
        />
        <button className="px-4 py-2 rounded-r-md bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors duration-200">
          Search
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
