import React from 'react';
import useStore from '../state/friendStore';

const AddFriendButton = () => {
  const { addFriend } = useStore((s) => s.userSlice);

  const handleAdd = () => {
    const newFriend = {
      id: Date.now().toString(),
      name: 'New Friend',
      avatar: 'https://i.pravatar.cc/150?img=3',
      genres: ['Rock'],
      artists: ['Tame Impala'],
      matchPercent: Math.floor(Math.random() * 100),
    };

    addFriend(newFriend);
  };

  return (
    <button
      onClick={handleAdd}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Add Friend
    </button>
  );
};

export default AddFriendButton;
