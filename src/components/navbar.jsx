import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-transparent bg-opacity-70 backdrop-blur-sm shadow-md px-8 py-4 flex justify-between items-center text-white z-30 relative">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold text-blue-400 hover:text-blue-500 transition">
          Logo goes here
        </Link>
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>
        <Link to="/discover" className="hover:text-blue-400 transition">Discover</Link>
        <Link to="/map" className="hover:text-blue-400 transition">Map</Link>
      </div>

      {/* Center Search */}
      <div className="flex-1 mx-8">
        <input
          type="text"
          placeholder="Search artists, songs, or events"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right Section */}
      <div>
        <Link to="/profile" className="hover:text-blue-400 transition">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
