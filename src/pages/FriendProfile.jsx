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

import FollowersModal  from '../components/FriendsPage/FollowersModal';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../index.css';

const ResponsiveGrid = WidthProvider(Responsive);
const breakpoints = { xxs: 0, xs: 480, sm: 768, md: 996, lg: 1200 };
const cols        = { xxs: 1, xs: 2, sm: 4, md: 8, lg: 12 };

export default function FriendProfile() {
  /* ---------- params & stores ---------- */
  const { id: targetUserId } = useParams();                // /friends/:id
  const authUser          = useAuthStore((s) => s.user);
  const {
    tiles, fetchTiles, setCurrentUserId
  }                   = useProfileStore();
  const {
    friends, followUser, unfollowUser, userSlice
  }                   = useFriendStore((s) => s);

  const currentUserId = userSlice.currentUserId;
  const targetFriend  = friends.find((f) => f.id === targetUserId);
  const isOwner       = targetUserId === currentUserId;
  const isFollowing   = !!friends
    .find((f) => f.id === currentUserId)
    ?.following.includes(targetUserId);

  /* ---------- spotify data ---------- */
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

  /* ---------- modal state ---------- */
  const [modalType, setModalType] = useState(null); // 'followers' | 'following' | null

  /* ---------- initial load ---------- */
  useEffect(() => {
    if (!targetFriend) return;
    setCurrentUserId(targetUserId);
    fetchTiles(targetUserId, currentUserId);
    loadSpotify();
  }, [targetUserId, targetFriend, currentUserId, fetchTiles, setCurrentUserId, loadSpotify]);

  if (!targetFriend) {
    return <div className="min-h-screen flex items-center justify-center text-white">User not found.</div>;
  }

  /* ---------- follower lists & counts ---------- */
  const followersList = friends.filter((f) => f.following.includes(targetUserId));
  const followingList = friends.filter((f) => targetFriend.following.includes(f.id));
  const followersCount = followersList.length;
  const followingCount = followingList.length;

  /* ---------- layout (read-only) ---------- */
  const layoutItems = tiles.map((t) => ({
    i: t._id || t.id, x: t.x || 0, y: t.y || 0, w: t.w || 1, h: t.h || 1,
  }));

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-12 gap-6">
      {/* ← Back */}
      <Link to="/friends" className="absolute left-6 top-6 text-blue-400 hover:underline">
        ← Back to Friends
      </Link>

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
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
            {targetFriend.bio && <p className="text-white/70">{targetFriend.bio}</p>}
            <p className="text-white/40 text-sm">
              <span onClick={() => setModalType('followers')} className="cursor-pointer hover:underline">
                {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
              </span>{' '}
              •{' '}
              <span onClick={() => setModalType('following')} className="cursor-pointer hover:underline">
                {followingCount} following
              </span>
            </p>
          </div>
        </header>

        {/* spotify highlight cards */}
        <div className="space-y-6 mt-6">
          <div className="card"><FavoriteSongs   songs   ={spotifyData?.top         ?? []} /></div>
          <div className="card"><FavoriteArtists artists ={spotifyData?.top_artists ?? []} /></div>
          <div className="card"><RecentlyPlayed  recent  ={spotifyData?.recent      ?? []} /></div>
        </div>

        {/* tile grid (read-only) */}
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
            <div key={t._id || t.id} data-grid={{ x: t.x || 0, y: t.y || 0, w: t.w || 1, h: t.h || 1, i: t._id || t.id }}>
              <div className="card h-full"><Tile tile={t} /></div>
            </div>
          ))}
        </ResponsiveGrid>
      </section>

      {/* right col */}
      <aside className="col-span-12 lg:col-span-4">
        <div className="card backdrop-blur-lg h-full"><FriendActivity /></div>
      </aside>

      {/* modal */}
      {modalType && (
        <FollowersModal
          title={modalType === 'followers' ? 'Followers' : 'Following'}
          people={modalType === 'followers' ? followersList : followingList}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}
