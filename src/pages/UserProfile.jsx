import { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import Navbar from '../components/Navbar';
import Tile from '../components/Tile';
import TilePicker from '../components/TilePicker';
import TileEditor from '../components/TileEditor';

import { useProfileStore } from '../state/profileStore';

import FavoriteSongs from '../components/FavoriteSongs';
import FavoriteArtists from '../components/FavoriteArtists';
import RecentlyPlayed from '../components/RecentlyPlayed';
import FriendActivity from '../components/FriendActivity';
import ProfileHeader from '../components/ProfileHeader';

const ResponsiveGridLayout = WidthProvider(Responsive);

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('recent');

  const tiles = useProfileStore((s) => s.tiles);
  const editorOpen = useProfileStore((s) => s.editorOpen);
  const editingTileId = useProfileStore((s) => s.editingTileId);
  const tileToEdit = useProfileStore((s) => s.tiles.find((t) => t.id === editingTileId));
  const updateLayout = useProfileStore((s) => s.updateLayout);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-12 gap-6">
        {/* Left/Main */}
        <div className="col-span-12 lg:col-span-9 space-y-10">
          <ProfileHeader />

          {/* Tab Toggle */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-6 py-2 rounded-full text-lg font-semibold ${
                activeTab === 'recent'
                  ? 'bg-white text-black'
                  : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab('space')}
              className={`px-6 py-2 rounded-full text-lg font-semibold ${
                activeTab === 'space'
                  ? 'bg-white text-black'
                  : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'
              }`}
            >
              Space
            </button>
          </div>

          {/* Conditional View */}
          {activeTab === 'recent' ? (
            <div className="space-y-8">
              <FavoriteSongs />
              <FavoriteArtists />
              <RecentlyPlayed />
            </div>
          ) : (
            <div className="space-y-6">
              <TilePicker />
              <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: tiles.map(tile => ({
                  i: tile.id,
                  x: tile.x,
                  y: tile.y,
                  w: tile.w,
                  h: tile.h,
                })) }}
                breakpoints={{ lg: 1024 }}
                cols={{ lg: 4 }}
                rowHeight={150}
                isDraggable
                isResizable
                onLayoutChange={(layout) => updateLayout(layout)}
              >
                {tiles.map((tile) => (
                  <div key={tile.id} data-grid={{ x: tile.x, y: tile.y, w: tile.w, h: tile.h, i: tile.id }}>
                    <Tile tile={tile} />
                  </div>
                ))}
              </ResponsiveGridLayout>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="col-span-12 lg:col-span-3">
          <FriendActivity />
        </aside>
      </div>

      {/* Global Tile Editor */}
      {editorOpen && tileToEdit && <TileEditor tile={tileToEdit} />}
    </div>
  );
};

export default UserProfile;
