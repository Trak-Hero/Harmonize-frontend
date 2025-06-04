import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useAuthStore } from '../state/authStore';
import { useProfileStore } from '../state/profileStore';
import useFriendStore from '../state/friendStore';
import withTokenRefresh from '../utils/withTokenRefresh';

import Tile            from '../components/Tile';
import FavoriteSongs   from '../components/FavoriteSongs';
import FavoriteArtists from '../components/FavoriteArtists';
import RecentlyPlayed  from '../components/RecentlyPlayed';
import FriendActivity  from '../components/FriendActivity';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../index.css';

const ResponsiveGrid = WidthProvider(Responsive);
const breakpoints = { xxs: 0, xs: 480, sm: 768, md: 996, lg: 1200 };
const cols        = { xxs: 1, xs: 2, sm: 4, md: 8, lg: 12 };

export default function FriendProfile() {
  /* ---------- stores & params ---------- */
  const { id }  = useParams();                     // /friends/:id
  const API     = import.meta.env.VITE_API_BASE_URL;

  const authUser = useAuthStore((s) => s.user);

  const {
    tiles = [],
    fetchTiles,
    setCurrentUserId,
  } = useProfileStore();

  const {
    userSlice: { friends = [], followUser, unfollowUser, currentUserId } = {},
    addFriendToStore,
  } = useFriendStore();

  /* ---------- derived ---------- */
  const cached   = friends.find((f) => (f.id || f._id) === id);
  const [profile, setProfile] = useState(null);
  const targetFriend          = cached || profile;
  const isOwner               = id === currentUserId;

  const isFollowing =
    friends
      .find((f) => (f.id || f._id) === currentUserId)
      ?.following?.includes(id) ?? false;

  /* ---------- spotify data ---------- */
  const [spotifyData, setSpotifyData] = useState(null);

  const loadSpotify = useCallback(async () => {
    const res = await withTokenRefresh(
      () => fetch(`${API}/auth/api/user/${id}/spotify`, { credentials: 'include' }),
      () => fetch(`${API}/auth/refresh`, { credentials: 'include' })
    );
    if (!res?.ok) return;
    const data = await res.json();
    setSpotifyData({
      top:         data.top         ?? [],
      top_artists: data.top_artists ?? [],
      recent:      data.recent      ?? [],
    });
  }, [API, id]);

  /* ---------- fetch profile if missing ---------- */
  useEffect(() => {
    if (cached) return;

    fetch(`${API}/api/users/${id}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) return;
        setProfile(u);          // local render
        addFriendToStore?.(u);  // cache globally
      })
      .catch(console.error);
  }, [API, id, cached, addFriendToStore]);

  /* ---------- load tiles & spotify once we have the user ---------- */
  useEffect(() => {
    if (!targetFriend) return;

    if (currentUserId !== id) setCurrentUserId(id);

    fetchTiles(id);     // tiles don’t depend on currentUserId any more
    loadSpotify();
  }, [
    id,
    targetFriend,       // effect waits until profile present
    currentUserId,
    setCurrentUserId,
    fetchTiles,
    loadSpotify,
  ]);

  /* ---------- guard: still loading ---------- */
  if (!targetFriend) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  /* ---------- follower counts ---------- */
  const followersCount = friends.reduce(
    (acc, f) =>
      (f.following ?? []).some((fid) => fid === id) ? acc + 1 : acc,
    0
  );

  const followingCount = (targetFriend.following ?? []).length;

  /* ---------- grid layout ---------- */
  const layoutItems = tiles.map((t) => ({
    i: t._id || t.id,
    x: t.x || 0,
    y: t.y || 0,
    w: t.w || 1,
    h: t.h || 1,
  }));

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-12 gap-6">
      {/* ← Back */}
      <Link to="/friends" className="absolute left-6 top-6 text-blue-400 hover:underline">
        ← Back to Friends
      </Link>

      {/* -------- main column -------- */}
      <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* header */}
        <header className="flex items-center gap-6">
          <img
            src={targetFriend.avatar || 'https://placehold.co/150'}
            className="h-24 w-24 rounded-full object-cover border border-white/20"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-extrabold">
                {targetFriend.name || targetFriend.username || 'Unknown'}
              </h1>

              {!isOwner && (
                <button
                  onClick={() =>
                    isFollowing ? unfollowUser?.(id) : followUser?.(id)
                  }
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    isFollowing
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>

            {targetFriend.bio && (
              <p className="text-white/70">{targetFriend.bio}</p>
            )}

            <p className="text-white/40 text-sm">
              {followersCount} {followersCount === 1 ? 'follower' : 'followers'} •{' '}
              {followingCount} following
            </p>
          </div>
        </header>

        {/* spotify highlights */}
        <div className="space-y-6 mt-6">
          <div className="card">
            <FavoriteSongs songs={spotifyData?.top ?? []} />
          </div>
          <div className="card">
            <FavoriteArtists artists={spotifyData?.top_artists ?? []} />
          </div>
          <div className="card">
            <RecentlyPlayed recent={spotifyData?.recent ?? []} />
          </div>
        </div>

        {/* tiles */}
        <ResponsiveGrid
          className="layout mt-6"
          rowHeight={100}
          breakpoints={breakpoints}
          cols={cols}
          layouts={{ lg: layoutItems }}
          isDraggable={false}
          isResizable={false}
        >
          {tiles.map((t) => (
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
      </section>

      {/* -------- right column -------- */}
      <aside className="col-span-12 lg:col-span-4">
        <div className="card backdrop-blur-lg h-full">
          <FriendActivity />
        </div>
      </aside>
    </div>
  );
}
