/* ------------------------------------------------------------ */
import { useAuthStore }     from '../state/authStore';
import useFriendStore       from '../state/friendStore';
import FriendCard           from '../components/FriendsPage/FriendCard';
import FriendSearchBar      from '../components/FriendsPage/FriendSearch';

export default function Friends() {
  /* stores */
  const { user: authUser } = useAuthStore();
  const myId               = authUser?._id || authUser?.id;

  const {
    friends      = [],
    followUser,
    unfollowUser,
  } = useFriendStore();

  /* show only people I follow */
  const me        = friends.find((f) => String(f._id || f.id) === String(myId)) || {};
  const following = me.following ?? [];
  const visible   = friends.filter((f) => following.includes(f._id || f.id));

  return (
    <div className="max-w-5xl mx-auto pt-8 px-4">
      <FriendSearchBar />

      {visible.length ? (
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] mt-8">
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
        <p className="text-center text-gray-400 mt-8">
          You don’t follow anyone yet.
        </p>
      )}
    </div>
  );
}
