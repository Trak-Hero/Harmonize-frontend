// src/components/UserProfile.jsx
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
  const { user: authUser, isLoading: authLoading, hasCheckedSession, API_BASE } = useAuthStore();
  const { userId: paramUserId } = useParams();

  // Grab backend base-URL from authStore
  const API = API_BASE;

  // Build targetUserId and check ownership
  const targetUserId = paramUserId || (authUser?.id || authUser?._id);
  const isOwner = !paramUserId || (authUser && targetUserId === (authUser.id || authUser._id));

  const {
    tiles,
    editorOpen,
    editingTileId,
    isLoading: tilesLoading,
    fetchTiles,
    updateLayout,
    addTile,
    addTempTile,
    setEditorOpen,
    setCurrentUserId
  } = useProfileStore();

  const [activeTab,      setActiveTab]   = useState('recent');
  const [spotifyData,    setSpotifyData] = useState(null);
  const [showEditor,     setShowEditor]  = useState(false);
  const [spotifyLoading, setSpotifyLoading] = useState(false);

  /* ────────────────────────────────── 1) load tiles ────────────────────────────────── */
  useEffect(() => {
    if (!hasCheckedSession || authLoading) return;
    if (!authUser) return;
    if (!targetUserId) {
      console.log('[UserProfile] No targetUserId yet; skipping fetchTiles');
      return;
    }

    setCurrentUserId(targetUserId);
    fetchTiles(targetUserId, authUser.id || authUser._id);
  }, [
    hasCheckedSession,
    authLoading,
    authUser,
    targetUserId,
    fetchTiles,
    setCurrentUserId
  ]);

  /* ────────────────────────────────── 2) load Spotify (owner only, once) ────────────────────────────────── */
  const loadSpotify = useCallback(async () => {
    if (!isOwner) return;
    if (spotifyLoading) return;

    setSpotifyLoading(true);
    try {
      const res = await withTokenRefresh(
        // ← CHANGE THIS LINE to match your real backend route:
        // If your backend is `app.get('/spotify/me', …)`, use `/spotify/me`
        // If your backend is `app.get('/api/spotify/me', …)`, use `/api/spotify/me`
        () => fetch(`${API}/spotify/me`,        { credentials: 'include' }),
        () => fetch(`${API}/auth/refresh`,   { credentials: 'include' })
      );

      if (!res?.ok) {
        console.warn('[UserProfile] /spotify/me returned status:', res?.status);
        setSpotifyData(null);
        return;
      }

      // Check content‐type before calling res.json()
      const contentType = res.headers.get('Content-Type') || '';
      if (!contentType.includes('application/json')) {
        // Response is not JSON (we got HTML instead)
        const textBody = await res.text();
        console.warn(
          '[UserProfile] /spotify/me returned non-JSON. Body starts with:',
          textBody.slice(0, 200).replace(/\s+/g, ' ')
        );
        setSpotifyData(null);
        return;
      }

      // Safely parse JSON
      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error('[UserProfile] JSON parse error from /spotify/me:', parseErr);
        setSpotifyData(null);
        return;
      }

      setSpotifyData({
        top:         Array.isArray(data.top)         ? data.top         : [],
        top_artists: Array.isArray(data.top_artists) ? data.top_artists : [],
        recent:      Array.isArray(data.recent)      ? data.recent      : [],
      });
    } catch (error) {
      console.error('[UserProfile] Error loading Spotify data:', error);
      setSpotifyData(null);
    } finally {
      setSpotifyLoading(false);
    }
  }, [API, isOwner]);
  // Removed `spotifyLoading` from dependencies so toggling loading state doesn't re-trigger this.

  useEffect(() => {
    // Only attempt to load if:
    //   • session check is done
    //   • user is authenticated
    //   • this is the owner view
    //   • AND we have not already fetched spotifyData
    if (!hasCheckedSession || !authUser) return;
    if (!isOwner) return;
    if (spotifyData !== null) return; 
    // Once spotifyData goes from null → array, we will not re-fetch.

    loadSpotify();
  }, [hasCheckedSession, authUser, isOwner, spotifyData, loadSpotify]);

  /* ────────────────────────────────── 3) add‐tile handler ────────────────────────────────── */
  const handleAddTile = useCallback(
    (tileData = {}) => {
      if (!targetUserId) {
        console.warn('[UserProfile] Cannot add tile: targetUserId not set yet');
        return;
      }
      const tempId = addTempTile({
        ...tileData,
        userId: targetUserId,
        x: 0,
        y: Infinity,
        w: 2,
        h: 2,
        content: '',
      });
      setEditorOpen(true, tempId);
    },
    [targetUserId, addTempTile, setEditorOpen]
  );

  /* ────────────────────────────────── 4) loading & redirect logic ────────────────────────────────── */
  if (!hasCheckedSession || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (hasCheckedSession && !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        <div className="text-center space-y-4">
          <p>Please log in to view profiles</p>
          <a
            href="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (!targetUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────── 5) actual render ────────────────────────────────── */
  const layoutItems = Array.isArray(tiles)
    ? tiles.map(t => ({
        i:    t._id || t.id,
        x:    t.x || 0,
        y:    t.y || 0,
        w:    t.w || 1,
        h:    t.h || 1,
      }))
    : [];

  const tileBeingEdited = Array.isArray(tiles)
    ? tiles.find(t => (t._id || t.id) === editingTileId)
    : null;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-12 gap-6">
      {/* ──────────────── main column ──────────────── */}
      <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* header */}
        <header className="space-y-3 flex items-center gap-6">
          {authUser.avatar && (
            <img
              src={authUser.avatar}
              className="h-24 w-24 rounded-full object-cover border border-white/20"
              alt="Profile avatar"
            />
          )}

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-extrabold">
                {authUser.displayName || authUser.username || 'Your Profile'}
              </h1>
              {isOwner && (
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-4 py-2 bg-white text-black rounded-full text-sm hover:bg-zinc-200"
                >
                  Edit
                </button>
              )}
            </div>
            {authUser.bio && <p className="text-white/70">{authUser.bio}</p>}
            <p className="text-white/40 text-sm">0 Followers • 0 Following</p>
          </div>
        </header>

        {/* tab selector */}
        <nav className="flex gap-3 mt-4">
          {['recent', 'space'].map(tab => (
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
            {spotifyLoading ? (
              <div className="text-center py-8 text-white/60">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading Spotify data...</p>
              </div>
            ) : spotifyData ? (
              <>
                <div className="card">
                  <FavoriteSongs songs={spotifyData.top} />
                </div>
                <div className="card">
                  <FavoriteArtists artists={spotifyData.top_artists} />
                </div>
                <div className="card">
                  <RecentlyPlayed recent={spotifyData.recent} />
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-white/60">
                <p>No Spotify data available.</p>
                {isOwner && (
                  <p className="text-sm mt-2">
                    Connect your Spotify account to see recent activity.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {isOwner && (
              <div className="mb-4">
                <TilePicker onAdd={handleAddTile} />
              </div>
            )}

            {tilesLoading ? (
              <div className="text-center py-8 text-white/60">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading tiles...</p>
              </div>
            ) : Array.isArray(tiles) && tiles.length > 0 ? (
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
                {tiles.map(t => (
                  <div
                    key={t._id || t.id}
                    data-grid={{
                      x: t.x || 0,
                      y: t.y || 0,
                      w: t.w || 1,
                      h: t.h || 1,
                      i: t._id || t.id,
                    }}
                  >
                    <div className="card h-full">
                      <Tile tile={t} />
                    </div>
                  </div>
                ))}
              </ResponsiveGrid>
            ) : (
              <div className="text-center py-8 text-white/60">
                <p>No tiles to display.</p>
                {isOwner && (
                  <p className="text-sm mt-2">
                    Click “Space” → “Add Tile” to start building your profile.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ──────────────── right column ──────────────── */}
      <aside className="col-span-12 lg:col-span-4">
        <div className="card backdrop-blur-lg h-full">
          <FriendActivity />
        </div>
      </aside>

      {/* ──────────────── modal editors ──────────────── */}
      {editorOpen && isOwner && <TileEditor tile={tileBeingEdited} />}
      {showEditor && isOwner && <ProfileEditor onClose={() => setShowEditor(false)} />}
    </div>
  );
}

/* utility classname */
const card =
  'rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg p-6';
