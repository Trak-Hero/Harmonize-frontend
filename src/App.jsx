import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import MapPage from './pages/MapPage';
import ForYou from './pages/ForYou';
import ArtistProfile from './pages/ArtistProfile';
import SearchResults from './pages/SearchResults';
import ConnectSpotify from './pages/ConnectSpotify';
import SpotifyDashboard from './pages/SpotifyDashboard';
import UserProfile from './pages/UserProfile';
import Friends from './pages/Friends';


import './App.css';


function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10" />

      {/* App content */}
      <div className="relative z-20 flex flex-col h-full overflow-auto">
        <Navbar />

        <Routes>
          <Route
            index
            element={
              <div className="flex items-center justify-center h-full text-4xl font-bold text-blue-500">
                Hello from Reverberate
              </div>
            }
          />
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
