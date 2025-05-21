import React from 'react';
import { Route, Link } from 'react-router-dom';
import UserProfile from '../pages/UserProfile';

const Navbar = () => {
  return (
    <nav className="navbar flex justify-between items-center p-4 bg-black text-white">
      <div className="nav-left flex items-center gap-4">
        <Link to="/" className="nav-logo font-bold text-lg">Logo goes here</Link>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/discover" className="nav-link">Discover</Link>
      </div>

      <div className="nav-search">
        <input
          type="text"
          placeholder="Search artists, songs, or events"
          className="search-input px-2 py-1 rounded bg-neutral-800 text-white placeholder-gray-400"
        />
      </div>

      <div className="nav-right">
        <Link to="/profile" className="nav-link">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
