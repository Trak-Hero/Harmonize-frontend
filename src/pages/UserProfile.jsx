// src/pages/UserProfile.jsx
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
// import FriendActivity  from '../components/FriendActivity';
import ProfileEditor   from '../components/ProfileEditor';
import FavoritePlaylists from '../components/FavoritePlaylists';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../index.css';

const ResponsiveGrid = WidthProvider(Responsive);
const breakpoints = { xxs: 0, xs: 480, sm: 768, md: 996, lg: 1200 };
const cols        = { xxs: 1, xs: 2, sm: 4,  md: 8,  lg: 12 };

export default function UserProfile() {
  /* ─────────────────────────────────── state & stores ────────────────────────────────── */
  const {
    user: authUser,
    isLoading: authLoading,
    hasCheckedSession,
    // We no longer trust API_BASE here; it comes in as undefined in production.
    API_BASE
  } = useAuthStore();

  const { userId: paramUserId } = useParams();
  const targetUserId = paramUserId || (authUser?.id || authUser?._id);
  const isOwner =
    !paramUserId ||
    (authUser && targetUserId === (authUser.id || authUser._id));

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

  // Spotify data from /api/me/spotify
  const [spotifyData,    setSpotifyData]   = useState(null);
  const [spotifyLoading, setSpotifyLoading] = useState(false);

  // "appRecent" = data from GET /api/recent
  const [appRecent, setAppRecent] = useState([]);

  // User profile data with followers/following counts
  const [userProfile, setUserProfile] = useState(null);

  const [activeTab,  setActiveTab]  = useState('recent');
  const [showEditor, setShowEditor] = useState(false);

  // ─── HERE IS THE CRUCIAL FIX ───
  // Instead of using `API_BASE` (which was undefined), pull the Vite env var DIRECTLY:
  const API = import.meta.env.VITE_API_BASE_URL || '';
  console.log('[UserProfile] API is:', API);

  /* ────────────────────────────────── 1) load tiles ────────────────────────────────── */
  useEffect(() => {
    if (!hasCheckedSession || authLoading) return;
    if (!authUser) return;
    if (!targetUserId) {
      console.log('[UserProfile] No targetUserId; skipping fetchTiles');
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

  /* ────────────────────────────────── 1.5) load user profile data with followers/following ────────────────────────────────── */
  useEffect(() => {
    if (!hasCheckedSession || authLoading) return;
    if (!authUser) return;
    if (!targetUserId) return;

    // Fetch user profile data to get followers and following counts
    fetch(`${API}/api/users/${targetUserId}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          console.warn('[UserProfile] GET /api/users/:id returned', res.status);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUserProfile(data);
        }
      })
      .catch((err) => {
        console.error('[UserProfile] Error fetching user profile:', err);
      });
  }, [hasCheckedSession, authLoading, authUser, targetUserId, API]);

  /* ────────────────────────────────── 2) load "app‐recent" from your own API ────────────────────────────────── */
  useEffect(() => {
    if (!hasCheckedSession || authLoading) return;
    if (!authUser) return;
    if (!targetUserId) return;
  
    // Fix: Use the correct endpoint path
    fetch(`${API}/api/recent`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          console.warn('[UserProfile] GET /api/recent returned', res.status);
          return [];
        }
        return res.json();
      })
      .then((data) => {
        setAppRecent(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('[UserProfile] Error fetching /api/recent:', err);
        setAppRecent([]);
      });
  }, [hasCheckedSession, authLoading, authUser, targetUserId, API]);

  /* ────────────────────────────────── 3) load Spotify (owner only, once) ────────────────────────────────── */
  const loadSpotify = useCallback(async () => {
    if (!isOwner) return;
    if (spotifyLoading) return;

    setSpotifyLoading(true);
    try {
      // → ALWAYS prefix with `${API}` so we don't accidentally land on React's HTML
      const res = await withTokenRefresh(
        () => fetch(`${API}/api/me/spotify`, { credentials: 'include' }),
        () => fetch(`${API}/auth/refresh`,   { credentials: 'include' })
      );

      if (!res?.ok) {
        console.warn('[UserProfile] /api/me/spotify status:', res?.status);
        setSpotifyData(null);
        return;
      }

      const contentType = res.headers.get('Content-Type') || '';
      if (!contentType.includes('application/json')) {
        const textBody = await res.text();
        console.warn(
          '[UserProfile] /api/me/spotify returned non-JSON. Body starts with:',
          textBody.slice(0, 200).replace(/\s+/g, ' ')
        );
        setSpotifyData(null);
        return;
      }

      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error(
          '[UserProfile] JSON parse error from /api/me/spotify:',
          parseErr
        );
        setSpotifyData(null);
        return;
      }

      setSpotifyData({
        top:         Array.isArray(data.top)         ? data.top : [],
        top_artists: Array.isArray(data.top_artists) ? data.top_artists : [],
        recent:      Array.isArray(data.recent)      ? data.recent : [],
        playlists:   Array.isArray(data.playlists)   ? data.playlists : []
      });
    } catch (error) {
      console.error('[UserProfile] Unexpected error loading Spotify data:', error);
      setSpotifyData(null);
    } finally {
      setSpotifyLoading(false);
    }
  }, [API, isOwner, spotifyLoading]);

  useEffect(() => {
    if (!hasCheckedSession || !authUser) return;
    if (!isOwner) return;
    if (spotifyData !== null) return; // already fetched once
    loadSpotify();
  }, [hasCheckedSession, authUser, isOwner, spotifyData, loadSpotify]);

  /* ────────────────────────────────── 4) add‐tile handler ────────────────────────────────── */
  const handleAddTile = useCallback(
    (tileData = {}) => {
      if (!targetUserId) {
        console.warn('[UserProfile] Cannot add tile: no targetUserId');
        return;
      }
      const tempId = addTempTile({
        ...tileData,
        userId: targetUserId,
        x: 0,
        y: Infinity,
        w: 2,
        h: 2,
        content: ''
      });
      setEditorOpen(true, tempId);
    },
    [targetUserId, addTempTile, setEditorOpen]
  );

  /* ────────────────────────────────── 5) loading & redirect logic ────────────────────────────────── */
  if (!hasCheckedSession || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (hasCheckedSession && !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        <div className="text-center space-y-4">
          <p>Please log in to view profiles.</p>
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
          <p>Loading profile…</p>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────── 6) actual render ────────────────────────────────── */
  const layoutItems = Array.isArray(tiles)
    ? tiles.map((t) => ({
        i:    t._id || t.id,
        x:    t.x || 0,
        y:    t.y || 0,
        w:    t.w || 1,
        h:    t.h || 1
      }))
    : [];

  const tileBeingEdited = Array.isArray(tiles)
    ? tiles.find((t) => (t._id || t.id) === editingTileId)
    : null;

  // Choose which "recent" list to show:
  // • If SpotifyData.recent has items, show that
  // • Otherwise fall back to appRecent (from GET /api/recent)
  const effectiveRecent =
    Array.isArray(spotifyData?.recent) && spotifyData.recent.length > 0
      ? spotifyData.recent
      : appRecent;

  // Get followers and following counts from userProfile or fall back to authUser
  const profileData = userProfile || authUser;
  const followersCount = profileData?.followers?.length ?? 0;
  const followingCount = profileData?.following?.length ?? 0;

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
            <p className="text-white/40 text-sm">
              {followersCount} {followersCount === 1 ? 'follower' : 'followers'} • {followingCount} following
            </p>
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
            {spotifyLoading ? (
              <div className="text-center py-8 text-white/60">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading Spotify data…</p>
              </div>
            ) : effectiveRecent.length > 0 ? (
              <>
                <div className="card">
                  <FavoriteSongs songs={spotifyData?.top ?? []} />
                </div>
                <div className="card">
                  <FavoriteArtists artists={spotifyData?.top_artists ?? []} />
                </div>
                <div className="card">
                  <RecentlyPlayed recent={effectiveRecent} />
                </div>
                {Array.isArray(spotifyData?.playlists) && spotifyData.playlists.length > 0 && (
                  <div className="card">
                    <FavoritePlaylists playlists={spotifyData.playlists} />
                  </div>
                )}
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
                <p>Loading tiles…</p>
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
                {tiles.map((t) => (
                  <div
                    key={t._id || t.id}
                    data-grid={{
                      x: t.x || 0,
                      y: t.y || 0,
                      w: t.w || 1,
                      h: t.h || 1,
                      i: t._id || t.id
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
                    Click "Space" → "Add Tile" to start building your profile.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ──────────────── right column ────────────────
      <aside className="col-span-12 lg:col-span-4">
        <div className="card backdrop-blur-lg h-full">
          <FriendActivity />
        </div>
      </aside> */}

      {/* ──────────────── modal editors ──────────────── */}
      {editorOpen && isOwner && <TileEditor tile={tileBeingEdited} />}
      {showEditor && isOwner && <ProfileEditor onClose={() => setShowEditor(false)} />}
    </div>
  );
}

/* utility classname */
const card =
  'rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg p-6';