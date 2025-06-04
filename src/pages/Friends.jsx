/* src/pages/Friends.jsx
   ------------------------------------------------------------ */
import useFriendStore from '../state/friendStore';
import FriendCard      from '../components/FriendsPage/FriendCard';
import FriendSearchBar from '../components/FriendsPage/FriendSearch';

export default function Friends() {
  /* grab everything we need once from the store */
  const {
    currentUserId,
    friends,
    followUser,
    unfollowUser
  } = useFriendStore((s) => ({
    currentUserId : s.userSlice?.currentUserId,
    friends       : s.userSlice?.friends        ?? [],
    followUser    : s.userSlice?.followUser,
    unfollowUser  : s.userSlice?.unfollowUser,
  }));

  /* the user we’re logged in as */
  const me = friends.find((f) => String(f._id || f.id) === String(currentUserId));

  /* show only the people “me” follows */
  const peopleIFollow = friends.filter(
    (u) =>
      u &&                                  // safety
      u._id !== me?._id &&                  // not myself
      me?.following?.some((id) => String(id) === String(u._id || u.id))
  );

  return (
    <div className="px-4 pt-6 max-w-5xl mx-auto">
      {/* 🔍 username search */}
      <FriendSearchBar />

      {peopleIFollow.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {peopleIFollow.map((friend) => {
            const isFollowing = true;  // by definition of the filter above

            return (
              <div key={friend._id || friend.id} className="space-y-2">
                <FriendCard friend={friend} />

                <button
                  onClick={() =>
                    isFollowing
                      ? unfollowUser?.(friend._id || friend.id)
                      : followUser?.(friend._id || friend.id)
                  }
                  className={`w-full py-1.5 rounded ${
                    isFollowing
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white text-sm`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-8">
          You don’t follow anyone yet.
        </p>
      )}
    </div>
  );
}
