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
import FriendProfile from './pages/FriendProfile';
import { useEffect } from 'react';
import { useAuthStore } from './state/authStore';

import './App.css';

function App() {
  const { fetchUser, hasCheckedSession, isLoading, user } = useAuthStore();

  useEffect(() => {
    // Only fetch user session if we haven't checked yet
    // This prevents unnecessary API calls on every reload
    if (!hasCheckedSession) {
      fetchUser();
    }
  }, [fetchUser, hasCheckedSession]);

  // Optional: Show loading spinner while checking session
  if (!hasCheckedSession && isLoading) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg">Loading...</div>
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
          <Route path="/friends/:id" element={<FriendProfile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
