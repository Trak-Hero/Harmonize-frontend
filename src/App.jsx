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

import './App.css';;

function App() {
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
