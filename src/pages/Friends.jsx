/* ------------------------------------------------------------ */
import { useState }          from 'react';
import { useAuthStore }      from '../state/authStore';
import useFriendStore        from '../state/friendStore';

import FriendCard            from '../components/FriendsPage/FriendCard';
import FriendSearchModal     from '../components/FriendsPage/FriendSearch';

export default function Friends() {
  /* modal state */
  const [open, setOpen] = useState(false);

  /* auth */
  const { user: authUser } = useAuthStore();
  const myId               = authUser?._id || authUser?.id;

  /* friends store */
  const { friends = [], followUser, unfollowUser } = useFriendStore();

  /* show only the people I follow */
  const me = friends.find((f) => String(f._id || f.id) === String(authUser?._id || authUser?.id));
  const following = me?.following ?? [];

  const visible = friends.filter((f) =>
    following.some((fid) => String(fid) === String(f._id || f.id))
  );
  return (
    <div className="max-w-5xl mx-auto pt-8 px-4">
      {/* header + button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Friends</h1>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Find friends
        </button>
      </div>

      {/* friends grid */}
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
        <p className="text-center text-gray-400">
          You don’t follow anyone yet.
        </p>
      )}

      {/* search modal */}
      {open && <FriendSearchModal onClose={() => setOpen(false)} />}
    </div>
  );
}
