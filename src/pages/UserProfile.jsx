import { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

import Navbar from '../components/navbar';
import Tile from '../components/Tile';
import TilePicker from '../components/TilePicker';
import TileEditor from '../components/TileEditor';
import FavoriteSongs from '../components/FavoriteSongs';
import FavoriteArtists from '../components/FavoriteArtists';
import RecentlyPlayed from '../components/RecentlyPlayed';
import FriendActivity from '../components/FriendActivity';
import ProfileHeader from '../components/ProfileHeader';

import { useProfileStore } from '../state/profileStore';
import '../index.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [spotifyData, setSpotifyData] = useState(null);

  const {
    tiles,
    editorOpen,
    editingTileId,
    updateLayout,
    fetchTiles,
  } = useProfileStore();

  const tileToEdit = tiles.find((t) => t._id === editingTileId);
  const { userId } = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const isOwner = !userId || (currentUser && userId === currentUser.id);

  useEffect(() => {
    if (userId && currentUser) {
      fetchTiles(userId, currentUser.id);
    }
  }, [userId, currentUser, fetchTiles]);

  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const res = await fetch(`${API}/api/me/spotify`, {
          credentials: 'include',
        });
        const data = await res.json();
        setSpotifyData(data);
      } catch (err) {
        console.error('Failed to fetch Spotify data:', err);
      }
    };

    if (isOwner) fetchSpotifyData();
  }, [isOwner, API]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading your profile...
      </div>
    );
  }

  const layout = tiles.map((tile) => ({
    i: tile._id,
    x: tile.x || 0,
    y: tile.y || Infinity,
    w: tile.w || 1,
    h: tile.h || 1,
  }));

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* Dynamic Profile Header */}
        <ProfileHeader />

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-6 py-2 rounded-full text-lg font-semibold ${
              activeTab === 'recent'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white/70 border border-white/30'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveTab('space')}
            className={`px-6 py-2 rounded-full text-lg font-semibold ${
              activeTab === 'space'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white/70 border border-white/30'
            }`}
          >
            Space
          </button>
        </div>

        {activeTab === 'recent' ? (
          <div className="space-y-6 mt-6">
            <div className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg p-6">
              <FavoriteSongs songs={spotifyData?.top ?? []} />
            </div>
            <div className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg p-6">
              <FavoriteArtists artists={spotifyData?.top_artists ?? []} />
            </div>
            <div className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg p-6">
              <RecentlyPlayed recent={spotifyData?.recent ?? []} />
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {isOwner && <TilePicker />}
            <ResponsiveGridLayout
              className="layout"
              rowHeight={100}
              cols={{ lg: 4, md: 3, sm: 2, xs: 1 }}
              layouts={{ lg: layout }}
              onLayoutChange={(newLayout) => {
                if (isOwner) updateLayout(newLayout);
              }}
              isDraggable={isOwner}
              isResizable={isOwner}
            >
              {tiles.map((tile) => (
                <div
                  key={tile._id}
                  data-grid={{
                    x: tile.x || 0,
                    y: tile.y || Infinity,
                    w: tile.w || 1,
                    h: tile.h || 1,
                  }}
                >
                  <div className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg h-full">
                    <Tile tile={tile} />
                  </div>
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        )}
      </div>

      <aside className="col-span-12 lg:col-span-4">
        <div className="rounded-xl backdrop-blur-lg bg-gradient-to-br from-white/5 via-black/10 to-white/5 p-6 shadow-lg border border-white/20 h-full">
          <FriendActivity />
        </div>
      </aside>

      {editorOpen && tileToEdit && isOwner && <TileEditor tile={tileToEdit} />}
    </div>
  );
};

export default UserProfile;
