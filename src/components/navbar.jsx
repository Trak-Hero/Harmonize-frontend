import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <a href="/" className="nav-logo">Logo goes here</a>
        <a href="/" className="nav-link">Home</a>
        <a href="/discover" className="nav-link">Discover</a>
        <a href="/artist/682bf9f0d8dee0de66ba4825" className="nav-link">Demo Artist</a>
      </div>

      <div className="nav-search">
        <input
          type="text"
          placeholder="Search artists, songs, or events"
          className="search-input"
        />
      </div>

      <div className="nav-right">
        <a href="/profile" className="nav-link">Profile</a>
      </div>
    </nav>
  );
};

export default Navbar;