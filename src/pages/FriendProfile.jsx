import { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useParams } from 'react-router-dom';
import { useAuthStore }   from '../state/authStore';
import { useProfileStore } from '../state/profileStore';
import useFriendStore      from '../state/friendStore';
import withTokenRefresh    from '../utils/withTokenRefresh';

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
  /* ───────── params & stores ───────── */
  const { id: paramUserId, userId } = useParams();
  const authUser = useAuthStore((s) => s.user);
  const targetUserId = paramUserId || authUser?.id;
  const isOwner = targetUserId === authUser?.id;

  const {
    tiles, fetchTiles, setCurrentUserId
  } = useProfileStore();

  const { friends, getFriendById, followUser, unfollowUser } = useFriendStore((s) => s.userSlice);
  const targetFriend = getFriendById(targetUserId);

  const isFollowing  = friends
    .find(f => f.id === authUser?.id)
    ?.following.includes(targetUserId);

  /* ───────── spotify data ───────── */
  const [spotifyData, setSpotifyData] = useState(null);
  const API = import.meta.env.VITE_API_BASE_URL;

  const loadSpotify = useCallback(async () => {
    const res = await withTokenRefresh(
      () => fetch(`${API}/auth/api/user/${targetUserId}/spotify`, { credentials: 'include' }),
      () => fetch(`${API}/auth/refresh`, { credentials: 'include' })
    );
    if (!res?.ok) return;
    const data = await res.json();
    setSpotifyData({
      top:         data.top         ?? [],
      top_artists: data.top_artists ?? [],
      recent:      data.recent      ?? [],
    });
  }, [API, targetUserId]);

  /* ───────── initial load ───────── */
  useEffect(() => {
    if (!authUser || !targetUserId) return;
    setCurrentUserId(targetUserId);
    fetchTiles(targetUserId, authUser.id);  // ACL
    loadSpotify();
  }, [targetUserId, authUser, fetchTiles, setCurrentUserId, loadSpotify]);

  /* ───────── follower counts ───────── */
  const followersCount = friends.filter(f => f.following.includes(targetUserId)).length;
  const followingCount = targetFriend?.following.length ?? 0;

  /* ───────── responsive layout (view-only) ───────── */
  const layoutItems = tiles.map(t => ({ i: t._id || t.id, x: t.x || 0, y: t.y || 0, w: t.w || 1, h: t.h || 1 }));

  if (!authUser || !targetFriend) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading…</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-12 gap-6">
      {/* ─── main col ─── */}
      <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* header */}
        <header className="flex items-center gap-6">
          {targetFriend.avatar && (
            <img src={targetFriend.avatar} className="h-24 w-24 rounded-full object-cover border border-white/20" />
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-extrabold">{targetFriend.name}</h1>
              {!isOwner && (
                <button
                  onClick={() => (isFollowing ? unfollowUser(targetUserId) : followUser(targetUserId))}
                  className={`px-4 py-2 rounded-full text-sm ${
                    isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
            {targetFriend.bio && <p className="text-white/70">{targetFriend.bio}</p>}
            <p className="text-white/40 text-sm">
              {followersCount} Followers • {followingCount} Following
            </p>
          </div>
        </header>

        {/* ALWAYS recent tab (tiles are view-only) */}
        <div className="space-y-6 mt-6">
          <div className="card"><FavoriteSongs   songs   ={spotifyData?.top         ?? []} /></div>
          <div className="card"><FavoriteArtists artists ={spotifyData?.top_artists ?? []} /></div>
          <div className="card"><RecentlyPlayed  recent  ={spotifyData?.recent      ?? []} /></div>
        </div>

        {/* friend’s tile grid (read-only) */}
        <ResponsiveGrid
          className="layout mt-6"
          rowHeight={100}
          breakpoints={breakpoints}
          cols={cols}
          layouts={{ lg: layoutItems }}
          isDraggable={false}
          isResizable={false}
        >
          {tiles.map(t => (
            <div key={t._id || t.id} data-grid={{ x: t.x || 0, y: t.y || 0, w: t.w || 1, h: t.h || 1, i: t._id || t.id }}>
              <div className="card h-full"><Tile tile={t} /></div>
            </div>
          ))}
        </ResponsiveGrid>
      </section>

      {/* ─── right col ─── */}
      <aside className="col-span-12 lg:col-span-4">
        <div className="card backdrop-blur-lg h-full"><FriendActivity /></div>
      </aside>
    </div>
  );
}
