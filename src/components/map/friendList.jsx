import React from 'react';
import Friend from './friend';
import useLocationStore from '../../state/locationStore';

const FriendList = ({ friends, onSelect, visible=true }) => {
  const { currentUser } = useLocationStore();
  if (!visible) return null;

  const filteredFriends = (friends || []).filter(friend => {
    const coords = friend.location?.coordinates;
    const isValidCoords = Array.isArray(coords) && coords.length === 2 && (coords[0] !== 0 || coords[1] !== 0);
    const isNotCurrentUser = !currentUser || (friend._id !== currentUser._id && friend.id !== currentUser.id);
    return isValidCoords && isNotCurrentUser;
  });

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
