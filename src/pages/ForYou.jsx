import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MusicCard from '../components/MusicCard';

const ForYou = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/musicPosts'); // adjust path later
        const data = await res.json();
        console.log('Fetched posts:', data); // <- Add this line

        setFeed(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchFeed();
  }, []);

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
            {feed.map((item) => (
            <div key={item.id} className="snap-start h-screen flex items-center justify-center">
                <MusicCard key={item.id} item={item} />
            </div>
            ))}
        </div>
      
    </div>
  );
};

export default ForYou;