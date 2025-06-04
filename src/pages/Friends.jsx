// Friends.jsx
import { useEffect } from 'react';
import useFriendStore from '../state/friendStore';
import FriendCard from '../components/FriendsPage/FriendCard';
import FriendSearchBar from '../components/FriendsPage/FriendSearch';

export default function Friends() {
  const { friends = [], userSlice = {}, followUser, unfollowUser } =
    useFriendStore((s) => s);
  const currentUserId = userSlice.currentUserId;

  return (
    <div className="px-4 pt-6 max-w-5xl mx-auto">
      <FriendSearchBar />

      {friends.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => {
            const isMe        = friend.id === currentUserId;
            const iFollowThem =
              friends.find((f) => f.id === currentUserId)
                ?.following?.includes(friend.id) ?? false;

            return (
              <div key={friend.id} className="space-y-2">
                <FriendCard friend={friend} />

                {!isMe && (
                  <button
                    onClick={() =>
                      iFollowThem ? unfollowUser(friend.id) : followUser(friend.id)
                    }
                    className={`w-full py-1.5 rounded ${
                      iFollowThem
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white text-sm`}
                  >
                    {iFollowThem ? 'Unfollow' : 'Add Friend'}
                  </button>
                )}
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