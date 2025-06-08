import React from 'react';
import Friend from './friend';
import useLocationStore from '../../state/locationStore';

const FriendList = ({ friends, onSelect, visible=true }) => {
  const { currentUser } = useLocationStore();
  if (!visible) return null;

  const filteredFriends = friends.filter(
    (friend) => friend._id !== currentUser?._id && friend.id !== currentUser?.id
  );

  return (
    <div className="flex flex-col gap-4">
      {filteredFriends.length === 0 ? (
        <p className="text-white text-center">No friends found</p>
      ) : (
        filteredFriends.map((friend, idx) => (
          <Friend key={friend._id || idx} friend={friend} onSelect={onSelect} />
        ))
      )}
    </div>
  );
};

export default FriendList;
