import React from 'react';
import Friend from './friend';

const FriendList = ({ friends, onSelect, visible=true }) => {
  if (!visible) return null;
  return (
    <div className="flex flex-col gap-4">
      {friends.length === 0 ? (
        <p className="text-white text-center">No friends found</p>
      ) : (
        friends.map((friend, idx) => (
          <Friend key={friend._id || idx} friend={friend} onSelect={onSelect} />
        ))
      )}
    </div>
  );
};

export default FriendList;
