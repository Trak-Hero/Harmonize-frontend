import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Landing from './pages/Landing';
import MapPage from './pages/MapPage';
import ForYou from './pages/ForYou';
import ArtistProfile from './pages/ArtistProfile';
import SearchResults from './pages/SearchResults';
import ConnectSpotify from './pages/ConnectSpotify';
import SpotifyDashboard from './pages/SpotifyDashboard';
import UserProfile from './pages/UserProfile';
import Friends from './pages/Friends';
import Register from './pages/Register';
import Login from './pages/Login';
import { useEffect } from 'react';
import { useAuthStore } from './state/authStore';

import './App.css';

function App() {
  const { fetchUser, isLoading, isInitialized, user } = useAuthStore((s) => ({
    fetchUser: s.fetchUser,
    isLoading: s.isLoading,
    isInitialized: s.isInitialized,
    user: s.user
  }));

  useEffect(() => {
    // Always try to fetch user on app load to verify session
    fetchUser();
  }, [fetchUser]);

  // Show loading spinner while checking authentication
  if (!isInitialized && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* App content */}
      <div className="relative z-20 flex flex-col h-full overflow-auto">
        <Navbar />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/discover" element={<ForYou />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/connect" element={<ConnectSpotify />} />
          <Route path="/dashboard" element={<SpotifyDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;