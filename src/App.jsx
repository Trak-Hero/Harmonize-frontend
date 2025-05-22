import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Navbar from './components/navbar';
import MapPage from './pages/MapPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
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
              <div className="relative z-20">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-screen text-4xl font-bold text-blue-500 gap-6">
                  <p>Hello from Reverberate</p>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  );
}


export default App;
