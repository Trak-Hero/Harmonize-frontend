import { useState, useEffect } from 'react';
import { useAuthStore } from '../state/authStore';
import useFriendStore from '../state/friendStore';

import FriendCard from '../components/FriendsPage/FriendCard';
import FriendSearchModal from '../components/FriendsPage/FriendSearch';

export default function Friends() {
  const [open, setOpen] = useState(false);
  const { user: authUser } = useAuthStore();
  const { 
    friends = [], 
    fetchFriends, 
    followUser, 
    unfollowUser, 
    setCurrentUserId 
  } = useFriendStore();

  useEffect(() => {
    if (authUser?._id) {
      setCurrentUserId(authUser._id);
    }
  }, [authUser, setCurrentUserId]);

  useEffect(() => {
    if (authUser?._id) {
      fetchFriends?.();
    }
  }, [fetchFriends, authUser]);

  const myId = authUser?._id || authUser?.id;

  const me = friends.find((f) => String(f._id || f.id) === String(myId));
  const following = me?.following ?? [];

  const visible = friends.filter((f) =>
    following.some((fid) => String(fid) === String(f._id || f.id)) &&
    String(f._id || f.id) !== String(myId) 
  );

  return (
    <div className="w-full max-w-5xl mx-auto pt-8 px-4">
      <div className="flex items-center justify-between gap-6 mb-6">
        <h1 className="text-2xl font-bold">Friends</h1>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Find friends
        </button>
      </div>

      {visible.length ? (
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {visible.map((friend) => (
            <FriendCard
              key={friend._id || friend.id}
              friend={friend}
              followUser={followUser}
              unfollowUser={unfollowUser}
            />
          ))}
        </div>
      ) : (
        <div className="mt-24 w-full flex justify-center">
          <p className="max-w-xs text-center text-gray-400">
            You don't follow anyone yet. Add a friend to see their activity here.
          </p>
        </div>
      )}

      {open && <FriendSearchModal onClose={() => setOpen(false)} />}
    </div>
  );
}