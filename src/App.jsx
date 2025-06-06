import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

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
import CreatePost from './pages/CreatePost';
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login';
import FriendProfile from './pages/FriendProfile';
import { useEffect } from 'react';
import { useAuthStore } from './state/authStore';
import Galaxy from './pages/Galaxy';
import BlendPage from './pages/BlendPage';

import { useAuthStore } from './state/authStore';
import useFriendStore from './state/friendStore';

import './App.css';

function App() {
  const { fetchUser, hasCheckedSession, isLoading, user: authUser } = useAuthStore();
  const { addFriendToStore } = useFriendStore();

  useEffect(() => {
    // Only fetch user session if we haven't checked yet
    // This prevents unnecessary API calls on every reload
    if (!hasCheckedSession) {
      fetchUser();
    }
  }, [fetchUser, hasCheckedSession]);

  // ✅ Sync authUser into friendStore on login
  useEffect(() => {
    if (authUser?._id) {
      addFriendToStore(authUser);
    }
  }, [authUser, addFriendToStore]);

    if (!hasCheckedSession) {
      fetchUser();
    }
  }, [fetchUser, hasCheckedSession]);

  // ✅ Add authUser to friend store for correct "me.following" behavior
  useEffect(() => {
    if (authUser?._id) {
      addFriendToStore(authUser);
    }
  }, [authUser, addFriendToStore]);

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
      <div className="relative z-20 flex flex-col h-full overflow-auto">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="/create" element={<CreatePost />} />
          <Route path="/galaxy" element={<Galaxy />} />
          <Route path="/blend" element={<BlendPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;