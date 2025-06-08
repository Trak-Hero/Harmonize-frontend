import { useEffect, useState } from "react";
import axios from "axios";

import MediaCard   from "../components/MediaCard";
import Carousel    from "../components/Carousel";
import GenreStats  from "../components/GenreStats";
import mapTrack    from "../utils/mapTrack";
import GenreTimeline from '../components/GenreTimeline';
import GenreMap from '../components/GenreMap';

const API = import.meta.env.VITE_API_BASE_URL ?? "";

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [topAlbums,       setTopAlbums]       = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        console.log("Home: Fetching data from API:", API);
        let recRes;
        try {
          recRes = await axios.get(`${API}/api/recommendations`, {
            withCredentials: true,
            timeout: 10000,
          });
        } catch (err) {
          const status = err.response?.status;
          console.warn("Home: Recommendations request failed:", status || err.message);
          if (status === 403) {
            setError("Please connect your Spotify account to see recommendations.");
          } else if (status === 204) {
            setError("We couldn't generate recommendations yet. Try listening to more music!");
          } else {
            setError("Unable to load recommendations. Please try again later.");
          }
          recRes = { data: [] };
        }
        
        if (cancelled) return;

        console.log("Raw recommendations data:", recRes.data);
        
        if (recRes.data && recRes.data.length > 0) {
          console.log("First recommendation item:", recRes.data[0]);
          console.log("First item artist field:", recRes.data[0].artist);
          console.log("First item artists field:", recRes.data[0].artists);
        }

        if (!Array.isArray(recRes.data)) {
          console.error("❌ Unexpected response (not an array):", recRes.data);
          setError("We couldn't load recommendations. Are you logged in?");
          return;
        }


        const mappedRecommendations = (recRes.data ?? []).map((track, index) => {
          console.log(`Processing track ${index}:`, track);
          
          let artistName = "Unknown Artist";
          
          if (Array.isArray(track.artists)) {
            artistName = track.artists.map(a => {
              if (typeof a === 'string') return a;
              if (typeof a === 'object' && a.name) return a.name;
              return String(a);
            }).join(", ");
          } else if (track.artist) {
            if (typeof track.artist === 'string') {
              artistName = track.artist;
            } else if (typeof track.artist === 'object' && track.artist.name) {
              artistName = track.artist.name;
            } else {
              artistName = String(track.artist);
            }
          }
          
          console.log(`Mapped artist name for track ${index}:`, artistName);
          
          return {
            ...track,
            artist: artistName
          };
        });

        console.log("Final mapped recommendations:", mappedRecommendations);

        let albumsArray = [];
        try {
          const spotifyRes = await axios.get(`${API}/api/me/spotify`, {
            withCredentials: true,
            timeout: 10000,
          });
          if (!cancelled && spotifyRes.data?.top) {
            const topTracks = spotifyRes.data.top;
            const albumMap = {};
            topTracks.forEach((t) => {
              const album = t.album || {};
              const albumId = album.id || album.name || String(Math.random());
              if (!albumMap[albumId]) {
                const imgUrl = Array.isArray(album.images) && album.images.length > 0
                  ? album.images[0].url
                  : "";
                const artistNames = Array.isArray(t.artists)
                  ? t.artists.map((a) => a.name || a).join(", ")
                  : typeof t.artist === 'object'
                  ? t.artist.name || String(t.artist)
                  : t.artist || "Unknown Artist";
                albumMap[albumId] = {
                  id: albumId,
                  name: album.name || "Unknown Album",
                  image: imgUrl,
                  artistNames,
                };
              }
            });
            albumsArray = Object.values(albumMap);
          }
        } catch (spotifyErr) {
          console.warn(
            "Home: Error fetching top tracks from /api/me/spotify:",
            spotifyErr.response?.status || spotifyErr.message
          );
        }
        if (!cancelled) {
          setRecommendations(mappedRecommendations);
          setTopAlbums(albumsArray);
        }
      } catch (err) {
        console.error("Home: Fetch error:", err);
        let errorMessage = "Failed to load data.";
        if (err.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Please try again.";
        } else if (err.response?.status === 401) {
          errorMessage = "Please log in to access your music data.";
        } else if (!navigator.onLine) {
          errorMessage = "No internet connection. Please check your connection.";
        }
        if (!cancelled) setError(errorMessage);
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
      <div className="bg-black flex items-center justify-center h-screen text-white text-lg">
        <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-white mx-auto" />
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
    <main className="pb-24 space-y-16 pt-20 px-4 bg-gradient-to-br from-[#0D0D0D] to-[#0D0D0D] min-h-screen">
      {topAlbums.length > 0 && (
        <section className="max-w-7xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight text-white drop-shadow">Top Albums</h2>
          <Carousel
            items={topAlbums}
            renderItem={(album) => (
              <div
                key={album.id}
                className="bg-white/5 rounded-2xl p-4 backdrop-blur-lg text-white flex flex-col items-center w-44 shadow-md border border-white/10 transition-transform ease-in-out hover:scale-102 duration-200"              >
                {album.image ? (
                  <img
                    src={album.image}
                    alt={album.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-800 flex items-center justify-center rounded mb-2">
                    <span className="text-gray-400 text-sm">No Cover</span>
                  </div>
                )}
                <div className="font-medium text-sm truncate w-full text-center">
                  {album.name}
                </div>
                <div className="text-xs text-gray-400 truncate w-full text-center">
                  {album.artistNames}
                </div>
              </div>
            )}
          />
        </section>
      )}

      <section className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white drop-shadow">Made For You</h2>
        {recommendations.length > 0 ? (
          <Carousel
            items={recommendations}
            renderItem={(item) => (
              <div key={item.id}
              className="bg-white/5 rounded-2xl p-4 backdrop-blur-lg text-white flex flex-col items-center w-44 shadow-md border border-white/10 transition-transform hover:scale-105 duration-200">
                {item.album?.images?.[0]?.url ? (
                  <img
                    src={item.album.images[0].url}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-800 flex items-center justify-center rounded mb-2">
                    <span className="text-gray-400 text-sm">No Cover</span>
                  </div>
                )}
                <div className="font-medium text-sm truncate w-full text-center">
                  {item.name || "Unknown Track"}
                </div>
                <div className="text-xs text-gray-400 truncate w-full text-center">
                  {typeof item.artist === 'string' ? item.artist : JSON.stringify(item.artist)}
                </div>
              </div>
            )}
          />
        ) : (
          <div className="text-center py-8 text-white/60">
            <p>No recommendations available.</p>
            <p className="text-sm mt-2">
              Connect your Spotify account or listen to more music to get personalized picks.
            </p>
          </div>
        )}
      </section>

      <section className="container mx-auto px-4">
        <GenreStats />
        <GenreTimeline />
        <GenreMap />
      </section>
    </main>
  );
}