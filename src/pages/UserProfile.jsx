import { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useParams } from 'react-router-dom';
import { useAuthStore }  from '../state/authStore';
import { useProfileStore } from '../state/profileStore';
import withTokenRefresh   from '../utils/withTokenRefresh';

import TilePicker      from '../components/TilePicker';
import Tile            from '../components/Tile';
import TileEditor      from '../components/TileEditor';
import FavoriteSongs   from '../components/FavoriteSongs';
import FavoriteArtists from '../components/FavoriteArtists';
import RecentlyPlayed  from '../components/RecentlyPlayed';
import FriendActivity  from '../components/FriendActivity';
import ProfileEditor   from '../components/ProfileEditor';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../index.css';

const ResponsiveGrid = WidthProvider(Responsive);
const breakpoints = { xxs: 0, xs: 480, sm: 768, md: 996, lg: 1200 };
const cols        = { xxs: 1, xs: 2, sm: 4,  md: 8,  lg: 12 };

export default function UserProfile() {
  /* ─────────────────────────────────── state & stores ────────────────────────────────── */
  const { userId: paramUserId } = useParams();
  const authUser     = useAuthStore((s) => s.user);                     // undefined on first render
  const targetUserId = paramUserId ?? authUser?.id ?? authUser?._id;    // fallback to _id too
  const isOwner      = !paramUserId || (authUser && targetUserId === authUser.id);

  const {
    tiles, editorOpen, editingTileId,
    fetchTiles, updateLayout, addTile, addTempTile, setEditorOpen, setCurrentUserId
  } = useProfileStore();

  const [activeTab,   setActiveTab]   = useState('recent');
  const [spotifyData, setSpotifyData] = useState(null);
  const [showEditor,  setShowEditor]  = useState(false);

  /* ────────────────────────────────── load tiles ────────────────────────────────── */
  useEffect(() => {
    if (!targetUserId || !authUser) return;

    setCurrentUserId(targetUserId); 
    fetchTiles(targetUserId, authUser.id);           // always pass ownerId for ACL
  }, [targetUserId, authUser, fetchTiles, setCurrentUserId]);

  /* ────────────────────────────────── load spotify data (owner) ────────────────────────────────── */
  const API = import.meta.env.VITE_API_BASE_URL;

  const loadSpotify = useCallback(async () => {
    const res = await withTokenRefresh(
      () => fetch(`${API}/auth/api/me/spotify`, { credentials: 'include' }),
      () => fetch(`${API}/auth/refresh`,        { credentials: 'include' })
    );
    if (!res?.ok) return;

    const data = await res.json();
    setSpotifyData({
      top:         data.top         ?? [],
      top_artists: data.top_artists ?? [],
      recent:      data.recent      ?? [],
    });
  }, [API]);

  useEffect(() => { if (isOwner) loadSpotify(); }, [isOwner, loadSpotify]);

  /* ────────────────────────────────── add‑tile handler ────────────────────────────────── */
  const handleAddTile = useCallback(
    (tileData = {}) => {
      if (!targetUserId)
        return console.warn('Add‑Tile blocked: user still loading');
      const tempId = addTempTile({
                ...tileData,
                userId: targetUserId,
                x: 0,
                y: Infinity,
                w: 2,
                h: 2,
                content: '',
              });
              /* 2️⃣ …then open the editor immediately */
              setEditorOpen(true, tempId);
    },
    [targetUserId, addTempTile, setEditorOpen]
  );

  /* ────────────────────────────────── loading guard ────────────────────────────────── */
  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading your profile…
      </div>
    );
  }

  /* ────────────────────────────────── derived values ────────────────────────────────── */
  const layoutItems = tiles.map((t) => ({
    i: t._id || t.id, x: t.x || 0, y: t.y || 0, w: t.w || 1, h: t.h || 1,
  }));
  const tileBeingEdited = tiles.find((t) => (t._id || t.id) === editingTileId);

  /* ────────────────────────────────── render ────────────────────────────────── */
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-12 gap-6">
      {/* ──────────────── main column ──────────────── */}
      <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* header */}
        <header className="space-y-3 flex items-center gap-6">
          {/* avatar */}
          {authUser.avatar && (
            <img src={authUser.avatar}
                className="h-24 w-24 rounded-full object-cover border border-white/20" />
          )}

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-extrabold">
                {authUser.displayName || 'Your Profile'}
              </h1>
              {isOwner && (
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-4 py-2 bg-white text-black rounded-full text-sm hover:bg-zinc-200">
                  Edit
                </button>
              )}
            </div>
            {authUser.bio && <p className="text-white/70">{authUser.bio}</p>}
            <p className="text-white/40 text-sm">0 Followers • — Following</p>
          </div>
        </header>

        {/* tab selector */}
        <nav className="flex gap-3 mt-4">
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
        </nav>

        {/* tab content */}
        {activeTab === 'recent' ? (
          <div className="space-y-6 mt-6">
            <div className="card"><FavoriteSongs   songs   ={spotifyData?.top         ?? []} /></div>
            <div className="card"><FavoriteArtists artists ={spotifyData?.top_artists ?? []} /></div>
            <div className="card"><RecentlyPlayed  recent  ={spotifyData?.recent      ?? []} /></div>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {isOwner && (
              <div className="mb-4">
                <TilePicker onAdd={handleAddTile} />
              </div>
            )}

            <ResponsiveGrid
              className="layout"
              rowHeight={100}
              breakpoints={breakpoints}
              cols={cols}
              layouts={{ lg: layoutItems }}
              onLayoutChange={isOwner ? updateLayout : undefined}
              isDraggable={isOwner}
              isResizable={isOwner}
            >
              {tiles.map((t) => (
                <div
                  key={t._id || t.id}
                  data-grid={{ x: t.x || 0, y: t.y || 0, w: t.w || 1, h: t.h || 1, i: t._id || t.id }}
                >
                  <div className="card h-full">
                    <Tile tile={t} />
                  </div>
                </div>
              ))}
            </ResponsiveGrid>
          </div>
        )}
      </section>

      {/* ──────────────── right column ──────────────── */}
      <aside className="col-span-12 lg:col-span-4">
        <div className="card backdrop-blur-lg h-full">
          <FriendActivity />
        </div>
      </aside>

      {/* ──────────────── modal editor ──────────────── */}
      {editorOpen && isOwner && (
        <TileEditor tile={tileBeingEdited} />
      )}
      {showEditor && isOwner && <ProfileEditor onClose={() => setShowEditor(false)} />}
    </div>
  );
}

/* utility classname */
const card =
  'rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg p-6';
