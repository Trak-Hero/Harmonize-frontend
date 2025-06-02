import { useEffect, useState } from "react";
import axios from "axios";

import MediaCard   from "../components/MediaCard";
import Carousel    from "../components/Carousel";
import FriendFeed  from "../components/FriendFeed";
import mapTrack    from "../utils/mapTrack";

const API = import.meta.env.VITE_API_BASE_URL ?? "";

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [recent, setRecent] = useState([]);
  const [friendActivity, setFriendActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        console.log('Home: Fetching data from API:', API);
        
        // Make requests with proper error handling
        const requests = [
          axios.get(`${API}/api/recommendations`, { 
            withCredentials: true,
            timeout: 10000 
          }).catch(err => {
            console.warn('Recommendations request failed:', err.response?.status || err.message);
            return { data: [] };
          }),
          
          axios.get(`${API}/api/recent`, { 
            withCredentials: true,
            timeout: 10000 
          }).catch(err => {
            console.warn('Recent tracks request failed:', err.response?.status || err.message);
            return { data: [] };
          }),
          
          axios.get(`${API}/api/friends/activity`, { 
            withCredentials: true,
            timeout: 10000 
          }).catch(err => {
            console.warn('Friend activity request failed:', err.response?.status || err.message);
            return { data: [] };
          }),
        ];

        const [recRes, recentRes, friendsRes] = await Promise.all(requests);

        if (cancelled) return;

        console.log('Home: Raw API responses:', {
          recommendations: recRes.data?.length || 0,
          recent: recentRes.data?.length || 0,
          friends: friendsRes.data?.length || 0
        });

        // Safely map tracks with additional error handling
        const safeMapTracks = (tracks, source) => {
          if (!Array.isArray(tracks)) {
            console.warn(`${source}: Expected array but got:`, typeof tracks);
            return [];
          }
          
          return tracks
            .map((track, index) => {
              try {
                const mapped = mapTrack(track);
                if (!mapped) {
                  console.warn(`${source}: mapTrack returned null for track at index ${index}`);
                  return null;
                }
                return mapped;
              } catch (error) {
                console.error(`${source}: Error mapping track at index ${index}:`, error, track);
                return null;
              }
            })
            .filter(track => track !== null && !track._error); // Filter out errors and nulls
        };

        const mappedRecommendations = safeMapTracks(recRes.data ?? [], 'Recommendations');
        const mappedRecent = safeMapTracks(recentRes.data ?? [], 'Recent');

        console.log('Home: Mapped tracks:', {
          recommendations: mappedRecommendations.length,
          recent: mappedRecent.length
        });

        setRecommendations(mappedRecommendations);
        setRecent(mappedRecent);
        setFriendActivity(friendsRes.data ?? []);
        
      } catch (err) {
        console.error("Home: Fetch error:", err);
        
        // Set a more specific error message
        let errorMessage = "Failed to load data.";
        
        if (err.code === 'ECONNABORTED') {
          errorMessage = "Request timed out. Please try again.";
        } else if (err.response?.status === 401) {
          errorMessage = "Please log in to access your music data.";
        } else if (err.response?.status === 403) {
          errorMessage = "Please connect your Spotify account.";
        } else if (err.response?.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (!navigator.onLine) {
          errorMessage = "No internet connection. Please check your connection.";
        }
        
        setError(errorMessage);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p>Loading your music...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400 text-center px-4">
        <div className="space-y-4">
          <p className="text-lg font-semibold">Oops! Something went wrong</p>
          <p className="text-sm text-white/70">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="pb-24 space-y-16">
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Made for you</h2>
        {recommendations.length > 0 ? (
          <Carousel
            items={recommendations}
            renderItem={(item) => <MediaCard key={item.id} media={item} />}
          />
        ) : (
          <div className="text-center py-8 text-white/60">
            <p>No recommendations available.</p>
            <p className="text-sm mt-2">Connect your Spotify account to see personalized recommendations.</p>
          </div>
        )}
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Recently played</h2>
        {recent.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recent.map((track) => (
              <MediaCard key={track.id} media={track} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/60">
            <p>No recent tracks found.</p>
            <p className="text-sm mt-2">Start listening to music on Spotify to see your recent tracks here.</p>
          </div>
        )}
      </section>

      <aside className="lg:fixed lg:right-6 lg:top-28 lg:w-72">
        <FriendFeed activity={friendActivity} />
      </aside>
    </main>
  );
}