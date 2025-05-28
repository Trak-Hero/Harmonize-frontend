import React from 'react';
import Friend from './friend';

const FriendList = ({ friends }) => {
  return (
    <div className="flex flex-col gap-4">
      {friends.length === 0 ? (
        <p className="text-white text-center">No friends found</p>
      ) : (
        friends.map((friend, idx) => (
          <Friend key={idx} friend={friend}/>
        ))
      )}
    </div>
  );
};

export default FriendList;
