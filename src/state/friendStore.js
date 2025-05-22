import { create } from 'zustand';

const mockFriends = [
  {
    id: '1',
    name: 'Mruno Bars',
    avatar: 'feature spec/mruno.png',
    genres: ['Indie', 'Jazz'],
    artists: ['Phoebe Bridgers', 'Tom Misch'],
    sharedPlaylists: [
      { id: 'p1', name: 'Late Night Vibes' },
      { id: 'p2', name: 'Roadtrip Mix' },
    ],
  },
  {
    id: '2',
    name: 'Chad B Simpson',
    avatar: 'feature spec/chad.png',
    genres: ['Hip-Hop', 'R&B'],
    artists: ['Kendrick Lamar', 'SZA'],
    sharedPlaylists: [
      { id: 'p3', name: 'Chill Beats' },
    ],
  },
  {
    id: '3',
    name: 'Lena Vibecheck',
    avatar: 'feature spec/lena.png',
    genres: ['Rock', 'Electronic'],
    artists: ['Tame Impala', 'The Valley'],
    sharedPlaylists: [],
  },
];

const useStore = create((set) => ({
  userSlice: {
    friends: [],
    fetchFriends: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        userSlice: {
          ...state.userSlice,
          friends: mockFriends,
        },
      }));
    },
  },
}));

export default useStore;
