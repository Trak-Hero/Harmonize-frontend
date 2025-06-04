import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MusicCard from '../components/MusicCard';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const ForYou = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/musicPosts`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Fetched posts:', data);
        setFeed(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your music feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading posts: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
        {/* Header with Create Post Tab */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
            <h1 className="text-3xl font-bold text-center flex-grow">Discover New Music For You</h1>
            <Link
                to="/create"
                className="ml-4 px-4 py-2 text-sm rounded-full bg-white text-black hover:bg-gray-200 transition"
            >
                Create a post
            </Link>
        </div>

        {/* Feed */}
        <div className="flex flex-col items-center snap-y snap-mandatory overflow-y-scroll h-screen px-4 py-6 space-y-6">
            {feed.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg mb-4">No music posts yet!</p>
                <Link
                  to="/create"
                  className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition"
                >
                  Create the first post
                </Link>
              </div>
            ) : (
              feed.map((item) => (
                <div key={item._id || item.id} className="snap-start h-screen flex items-center justify-center">
                    <MusicCard key={item._id || item.id} item={item} />
                </div>
              ))
            )}
        </div>
    </div>
  );
};

export default ForYou;