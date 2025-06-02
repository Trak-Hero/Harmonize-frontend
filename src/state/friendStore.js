import { create } from 'zustand';

const useFriendStore = create((set, get) => ({
  userSlice: {
    friends: [
      {
        id: '1',
        name: 'Alex Kim',
        avatar: 'https://i.pravatar.cc/150?img=1',
        genres: ['Indie', 'Jazz'],
        artists: ['Phoebe Bridgers', 'Tom Misch'],
        matchPercent: 82,
        followers: [],
        following: [],
        bio: 'Indie music lover',
      },
      {
        id: '2',
        name: 'Jordan Lee',
        avatar: 'https://i.pravatar.cc/150?img=2',
        genres: ['Hip-Hop'],
        artists: ['Kendrick Lamar', 'SZA'],
        matchPercent: 57,
        followers: [],
        following: [],
        bio: 'Hip-Hop and R&B enthusiast',
      },
    ],
    currentUserId: '1',

    followUser: (targetId) => {
      const { friends, currentUserId } = get().userSlice;
      const updated = friends.map(friend => {
        if (friend.id === targetId && !friend.followers.includes(currentUserId)) {
          return { ...friend, followers: [...friend.followers, currentUserId] };
        }
        if (friend.id === currentUserId && !friend.following.includes(targetId)) {
          return { ...friend, following: [...friend.following, targetId] };
        }
        return friend;
      });
      set((state) => ({ userSlice: { ...state.userSlice, friends: updated } }));
    },

    unfollowUser: (targetId) => {
      const { friends, currentUserId } = get().userSlice;
      const updated = friends.map(friend => {
        if (friend.id === targetId) {
          return { ...friend, followers: friend.followers.filter(id => id !== currentUserId) };
        }
        if (friend.id === currentUserId) {
          return { ...friend, following: friend.following.filter(id => id !== targetId) };
        }
        return friend;
      });
      set((state) => ({ userSlice: { ...state.userSlice, friends: updated } }));
    },
  },
}));

export default useFriendStore;
