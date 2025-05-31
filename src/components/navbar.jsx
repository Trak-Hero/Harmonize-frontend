// src/components/navbar.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import { Compass, Users, MapTrifold, ArrowRight } from '@phosphor-icons/react';

export default function Navbar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  // Get `user` and `logout()` from the store
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Simple search handler
  const search = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setQ('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 p-4 text-white flex items-center justify-between z-50">
      {/* Left side: Logo + Search */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-xl font-bold flex items-center space-x-1">
          <MapTrifold size={24} /> <span>Music & Memories</span>
        </Link>

        <form onSubmit={search} className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="px-3 py-1 rounded-l bg-gray-800 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded-r bg-blue-600 hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Right side: Links based on `user` */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link
              to="/profile"
              className="flex items-center space-x-1 hover:text-blue-400"
            >
              <Users size={20} />
              <span>Profile</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center space-x-1 hover:text-green-400"
            >
              <Compass size={20} />
              <span>Dashboard</span>
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
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-sm font-medium transition"
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
