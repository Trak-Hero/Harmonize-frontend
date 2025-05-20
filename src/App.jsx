import Navbar from './components/navbar';
import ArtistProfile from './pages/ArtistProfile';
import { Routes, Route } from 'react-router-dom';
import './App.css'

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
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 z-10" />
      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route index element={
            <div className="flex items-center justify-center h-screen text-4xl font-bold text-blue-500">
              Hello from Reverberate
            </div>} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;