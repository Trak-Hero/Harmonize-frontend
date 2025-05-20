import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import UserProfile from './pages/UserProfile';
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

      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 z-10" />

      <div className="relative z-20 h-full overflow-auto">
        <Navbar />

        <Routes>
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;