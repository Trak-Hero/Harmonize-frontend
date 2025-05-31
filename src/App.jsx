// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './state/authStore';

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

function App() {
  // Grab fetchUser() and user from the Zustand store
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // 1) On first mount, rehydrate from localStorage AND confirm with backend /me
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Navbar />

      <div className="pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/foryou" element={<ForYou />} />
          <Route path="/artist/:artistId" element={<ArtistProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/connect" element={<ConnectSpotify />} />

          {/* Protected Routes: Redirect to /login if not logged in */}
          <Route
            path="/dashboard"
            element={user ? <SpotifyDashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={user ? <UserProfile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/friends"
            element={user ? <Friends /> : <Navigate to="/login" replace />}
          />

          {/* Auth Routes: Redirect to /dashboard if already logged in */}
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <Register />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
