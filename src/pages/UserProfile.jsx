import { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

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
  const [spotifyData, setSpotifyData] = useState(null);

  const {
    tiles,
    editorOpen,
    editingTileId,
    updateLayout,
    fetchTiles,
    setCurrentUserId,
    addTile,
  } = useProfileStore();

  const { userId: routeUserId } = useParams();
  const currentUser = useAuthStore((s) => s.user);

  /* whose profile are we viewing? */
  const effectiveUserId = routeUserId ?? currentUser?.id;
  const isOwner = !routeUserId || routeUserId === currentUser?.id;

  /* make sure profileStore knows that ID *before* any clicks happen */
  useEffect(() => {
    if (!effectiveUserId || !currentUser) return;
    setCurrentUserId(effectiveUserId);
    fetchTiles(effectiveUserId, currentUser.id);
  }, [effectiveUserId, currentUser, setCurrentUserId, fetchTiles]);

  /* owner‑only spotify fetch */
  const API = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    if (!isOwner) return;
    (async () => {
      try {
        const res = await fetch(`${API}/auth/api/me/spotify`, {
          credentials: 'include',
        });
        if (res.status === 401) return;
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setSpotifyData({
          top: data.top || [],
          top_artists: data.top_artists || [],
          recent: data.recent || [],
        });
      } catch (err) {
        console.error('Failed to fetch Spotify data:', err);
      }
    })();
  }, [isOwner, API]);

  /* gate while we don’t know who we are */
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading your profile…
      </div>
    );
  }

  const tileToEdit =
    tiles.find((t) => t._id === editingTileId || t.id === editingTileId) ?? null;

  const layoutItems = tiles.map((tile) => ({
    i: tile._id || tile.id,
    x: tile.x ?? 0,
    y: tile.y ?? 0,
    w: tile.w ?? 1,
    h: tile.h ?? 1,
  }));

  const breakpoints = { xxs: 0, xs: 480, sm: 768, md: 996, lg: 1200 };
  const cols        = { xxs: 1, xs: 2, sm: 4, md: 8,  lg: 12  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-12 gap-6">
      {/* ‑‑‑‑‑ left column ‑‑‑‑‑ */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold">
            {isOwner ? currentUser.name || 'Your Profile' : 'Artist Profile'}
          </h1>
          <p className="text-white/70">0 Followers • — Following</p>
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

        {/* tabs */}
        <div className="flex gap-3 mt-4">
          {['recent', 'space'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-lg font-semibold ${
                activeTab === tab
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 border border-white/30'
              }`}
            >
              {tab === 'recent' ? 'Recent' : 'Space'}
            </button>
          ))}
        </div>

        {/* recent tab */}
        {activeTab === 'recent' && (
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
        )}

        {/* space tab */}
        {activeTab === 'space' && (
          <div className="space-y-6 mt-6">
            {isOwner && (
              <div className="mb-4">
                {/* pass the id so profileStore.addTile never complains */}
                <TilePicker
                  onAdd={(payload) =>
                    addTile({ ...payload, userId: effectiveUserId })
                  }
                />
              </div>
            )}

            <ResponsiveGridLayout
              className="layout"
              rowHeight={100}
              breakpoints={breakpoints}
              cols={cols}
              layouts={{ lg: layoutItems }}
              onLayoutChange={(newLayout) => {
                if (isOwner) updateLayout(newLayout);
              }}
              isDraggable={isOwner}
              isResizable={isOwner}
            >
              {tiles.map((tile) => (
                <div
                  key={tile._id || tile.id}
                  data-grid={{
                    x: tile.x ?? 0,
                    y: tile.y ?? 0,
                    w: tile.w ?? 1,
                    h: tile.h ?? 1,
                    i: tile._id || tile.id,
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

      {/* ‑‑‑‑‑ right column (friend activity) ‑‑‑‑‑ */}
      <aside className="col-span-12 lg:col-span-4">
        <div className="rounded-xl backdrop-blur-lg bg-gradient-to-br from-white/5 via-black/10 to-white/5 p-6 shadow-lg border border-white/20 h-full">
          <FriendActivity />
        </div>
      </aside>

      {/* modal editor */}
      {editorOpen && isOwner && (
        <TileEditor
          tile={
            tileToEdit || { title: '', w: 2, h: 2, x: 0, y: Infinity }
          }
        />
      )}
    </div>
  );
};

export default UserProfile;
