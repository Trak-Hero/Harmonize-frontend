import { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

import Navbar from '../components/Navbar';
import Tile from '../components/Tile';
import TilePicker from '../components/TilePicker';
import TileEditor from '../components/TileEditor';
import FavoriteSongs from '../components/FavoriteSongs';
import FavoriteArtists from '../components/FavoriteArtists';
import RecentlyPlayed from '../components/RecentlyPlayed';
import FriendActivity from '../components/FriendActivity';

import { useProfileStore } from '../state/profileStore';
import '../index.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('recent');

  const {
    tiles,
    editorOpen,
    editingTileId,
    updateLayout,
    fetchTiles,
  } = useProfileStore();

  const tileToEdit = tiles.find((t) => t._id === editingTileId);

  const { userId } = useParams(); // /profile/:userId
  const currentUser = useAuthStore((s) => s.user);

  const isOwner = !userId || (currentUser && userId === currentUser.id);

  // Fetch tiles only if viewing a profile with an ID (not anonymous)
  useEffect(() => {
    if (userId && currentUser) {
      fetchTiles(userId, currentUser.id);
    }
  }, [userId, currentUser]);

  // If user is not loaded yet, show fallback
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
      {/* Left - Profile Info */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold">
            {isOwner ? currentUser.name || 'Your Profile' : 'Tame Impala'}
          </h1>
          <p className="text-white/70">0 Followers • — Following</p>
          <div className="flex gap-4 mt-3">
            {!isOwner && (
              <button className="px-5 py-2 rounded-full bg-white text-black font-medium">
                Follow
              </button>
            )}
            <button className="px-5 py-2 rounded-full bg-white/10 text-white border border-white/30">
              Share
            </button>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Content */}
        {activeTab === 'recent' ? (
          <div className="space-y-6 mt-6">
            <div className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg p-6">
              <FavoriteSongs />
            </div>
            <div className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg p-6">
              <FavoriteArtists />
            </div>
            <div className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg p-6">
              <RecentlyPlayed />
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

      {/* Right - Sidebar */}
      <aside className="col-span-12 lg:col-span-4">
        <div className="rounded-xl backdrop-blur-lg bg-gradient-to-br from-white/5 via-black/10 to-white/5 p-6 shadow-lg border border-white/20 h-full">
          <FriendActivity />
        </div>
      </aside>

      {/* Tile Editor */}
      {editorOpen && tileToEdit && isOwner && <TileEditor tile={tileToEdit} />}
    </div>
  );
};

export default UserProfile;
