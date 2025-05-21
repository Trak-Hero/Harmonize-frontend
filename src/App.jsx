import { Routes, Route }     from 'react-router-dom';
import Navbar                from './components/navbar';
import ArtistProfile         from './pages/ArtistProfile';
import SearchResults         from './pages/SearchResults';
import './App.css';

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10" />

      <div className="relative z-10 flex flex-col h-full">
        <Navbar />

        <div className="flex-1 overflow-auto">
          <Routes>
            <Route
              index
              element={
                <div className="flex items-center justify-center h-full text-4xl font-bold text-blue-500">
                  Hello from Reverberate
                </div>
              }
            />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/search"   element={<SearchResults />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
