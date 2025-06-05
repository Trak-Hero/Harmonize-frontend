/* src/pages/FriendProfile.jsx
   --------------------------------------------------------------- */
import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { useAuthStore }   from '../state/authStore';
import { useProfileStore } from '../state/profileStore';
import useFriendStore      from '../state/friendStore';

import withTokenRefresh  from '../utils/withTokenRefresh';

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
  const { id } = useParams();
  const API = import.meta.env.VITE_API_BASE_URL || '';

  const { user: authUser } = useAuthStore();
  const {
    tiles,
    fetchTiles,
    setCurrentUserId
  } = useProfileStore();

  const {
    currentUserId,
    friends = [],
    followUser,
    unfollowUser,
    addFriendToStore
  } = useFriendStore();

  const cached = friends.find((f) => (f.id || f._id) === id);
  const [profile, setProfile] = useState(null);
  const friend = cached || profile;

  // Correct follow state using authUser (not currentUserId)
  const me = friends.find((f) => String(f._id || f.id) === String(authUser?._id || authUser?.id));
  const isOwner = String(authUser?._id || authUser?.id) === String(id);
  const isFollowing = !!me?.following?.some((fid) => String(fid) === String(id));

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowUser(id);
    } else {
      await followUser(id);
    }
    const updated = friends.find((f) => String(f._id || f.id) === String(id));
    if (updated) setProfile(updated);
  };

  const [spotifyData, setSpotifyData] = useState(null);

  const loadSpotify = useCallback(async () => {
    const res = await withTokenRefresh(
      () => fetch(`${API}/spotify/user/${id}`, { credentials: 'include' }),
      () => fetch(`${API}/auth/refresh`, { credentials: 'include' })
    );
    if (!res?.ok) return;
    const data = await res.json();
    setSpotifyData({
      top: data.top ?? [],
      top_artists: data.top_artists ?? [],
      recent: data.recent ?? []
    });
  }, [API, id]);

  useEffect(() => {
    if (cached) return;
    fetch(`${API}/api/users/${id}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) return;
        setProfile(u);
        addFriendToStore?.(u);
      })
      .catch(console.error);
  }, [API, id, cached, addFriendToStore]);

  useEffect(() => {
    if (!friend) return;
    if (currentUserId !== id) setCurrentUserId(id);
    fetchTiles(id);
    loadSpotify();
  }, [friend, id, currentUserId, setCurrentUserId, fetchTiles, loadSpotify]);

  if (!friend) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }
  const followersCount = friend.followers?.length ?? 0;
  const followingCount = friend.following?.length ?? 0;

  const layoutItems = tiles.map((t) => ({
    i: t._id || t.id,
    x: t.x || 0,
    y: t.y || 0,
    w: t.w || 1,
    h: t.h || 1
  }));

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-12 gap-6">
      <Link to="/friends" className="inline-block mt-4 mb-6 text-blue-600 hover:underline">
        ← Back to Friends
      </Link>

      <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <header className="flex items-center gap-6">
          <img
            src={friend.avatar || 'https://placehold.co/150'}
            className="h-24 w-24 rounded-full object-cover border border-white/20"
            alt="friend avatar"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-extrabold">
                {friend.displayName || friend.username || 'Friend'}
              </h1>

              {!isOwner && (
                <button
                  onClick={handleFollowToggle}
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

            {friend.bio && <p className="text-white/70">{friend.bio}</p>}
            <p className="text-white/40 text-sm">
              {followersCount} {followersCount === 1 ? 'follower' : 'followers'} • {followingCount} following
            </p>
          </div>
        </header>

        <div className="space-y-6 mt-6">
          <div className="card"><FavoriteSongs songs={spotifyData?.top ?? []} /></div>
          <div className="card"><FavoriteArtists artists={spotifyData?.top_artists ?? []} /></div>
          <div className="card"><RecentlyPlayed recent={spotifyData?.recent ?? []} /></div>
        </div>

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
            <div key={t._id || t.id} data-grid={{ ...t, i: t._id || t.id }}>
              <div className="card h-full">
                <Tile tile={t} />
              </div>
            </div>
          ))}
        </ResponsiveGrid>
      </section>

      <aside className="col-span-12 lg:col-span-4">
        <div className="card backdrop-blur-lg h-full">
          <FriendActivity />
        </div>
      </aside>
    </div>
  );
}
