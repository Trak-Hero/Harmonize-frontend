import { create } from 'zustand';

/* ───────────────────────────── mock users ───────────────────────────── */
const mockFriends = [
  {
    id: '1',
    name: 'Alex Kim',
    avatar: 'https://i.pravatar.cc/150?img=1',
    genres: ['Indie', 'Jazz'],
    artists: ['Phoebe Bridgers', 'Tom Misch'],
    matchPercent: 82,
    followers: ['2'],             // Jordan follows Alex
    following: ['3'],
    bio: 'Indie music lover',
  },
  {
    id: '2',
    name: 'Jordan Lee',
    avatar: 'https://i.pravatar.cc/150?img=2',
    genres: ['Hip-Hop', 'R&B'],
    artists: ['Kendrick Lamar', 'SZA'],
    matchPercent: 57,
    followers: [],
    following: ['1'],
    bio: 'Hip-Hop and R&B enthusiast',
  },
  {
    id: '3',
    name: 'Lena Vibecheck',
    avatar: 'https://i.pravatar.cc/150?img=3',
    genres: ['Rock', 'Electronic'],
    artists: ['Tame Impala', 'ODESZA'],
    matchPercent: 68,
    followers: ['1'],
    following: [],
    bio: 'Festival hopper 🎸',
  },
  {
    id: '4',
    name: 'Sam Adeyemi',
    avatar: 'https://i.pravatar.cc/150?img=4',
    genres: ['Afrobeats', 'Pop'],
    artists: ['Burna Boy', 'Rema'],
    matchPercent: 74,
    followers: [],
    following: [],
    bio: 'Afrobeats 24/7',
  },
  {
    id: '5',
    name: 'Mina Takahashi',
    avatar: 'https://i.pravatar.cc/150?img=5',
    genres: ['City-Pop', 'Lo-fi'],
    artists: ['Lamp', 'Nujabes'],
    matchPercent: 61,
    followers: [],
    following: [],
    bio: 'Late-night chill curator',
  },
];

/* ───────────────────────────── store ───────────────────────────── */
const useFriendStore = create((set, get) => ({
  userSlice: {
    friends: mockFriends,
    currentUserId: '1', // Alex is logged-in for dev

    /* follow / unfollow actions */
    followUser: (targetId) => {
      const { friends, currentUserId } = get().userSlice;
      const updated = friends.map((f) => {
        if (f.id === targetId && !f.followers.includes(currentUserId)) {
          return { ...f, followers: [...f.followers, currentUserId] };
        }
        if (f.id === currentUserId && !f.following.includes(targetId)) {
          return { ...f, following: [...f.following, targetId] };
        }
        return f;
      });
      set((state) => ({ userSlice: { ...state.userSlice, friends: updated } }));
    },

    unfollowUser: (targetId) => {
      const { friends, currentUserId } = get().userSlice;
      const updated = friends.map((f) => {
        if (f.id === targetId) {
          return { ...f, followers: f.followers.filter((id) => id !== currentUserId) };
        }
        if (f.id === currentUserId) {
          return { ...f, following: f.following.filter((id) => id !== targetId) };
        }
        return f;
      });
      set((state) => ({ userSlice: { ...state.userSlice, friends: updated } }));
    },

    /* handy selector for FriendProfile.jsx */
    getFriendById: (id) => get().userSlice.friends.find((f) => f.id === id),
  },
}));

export default useFriendStore;
