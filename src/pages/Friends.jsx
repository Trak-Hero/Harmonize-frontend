import React, { useEffect } from 'react';
import useStore from '../state/friendStore';
import FriendCard from '../components/FriendsPage/friendCard';

const Friends = () => {
  const { friends, fetchFriends } = useStore((s) => s.userSlice);

  useEffect(() => {
    fetchFriends?.();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Your Friends</h1>

      {friends && friends.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No friends yet — start exploring!</p>
      )}
    </div>
  );
};

export default Friends;
