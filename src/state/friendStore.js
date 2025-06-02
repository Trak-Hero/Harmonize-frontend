import { create } from 'zustand';
import { fetchTopArtists } from '../api/spotify';

const useStore = create((set) => ({
  userSlice: {
    friends: [],
    fetchFriends: async () => {
      try {
        const baseFriends = [
          {
            id: '1',
            name: 'Alex Kim',
            avatar: 'https://i.pravatar.cc/150?img=1',
            genres: ['Indie', 'Jazz'],
            artists: [],
            matchPercent: 82,
          },
          {
            id: '2',
            name: 'Jordan Lee',
            avatar: 'https://i.pravatar.cc/150?img=2',
            genres: ['Hip-Hop'],
            artists: [],
            matchPercent: 57,
          },
        ];

        let spotifyArtists = [];
        try {
          const res = await fetch('/api/spotify/top-artists');
          const contentType = res.headers.get('content-type');
          if (!res.ok || !contentType?.includes('application/json')) {
            const fallback = await res.text();
            console.warn('Non-JSON response from Spotify API:', fallback);
            throw new Error('Spotify API did not return JSON');
          }

          const data = await res.json();
          spotifyArtists = Array.isArray(data) ? data : data.items || [];
        } catch (error) {
          console.error('Failed to fetch top artists:', error);
        }

        const friendsWithSpotify = baseFriends.map((friend, index) => ({
          ...friend,
          artists: spotifyArtists.slice(index * 2, index * 2 + 2).map((artist) => artist.name),
        }));

        set((state) => ({
          userSlice: {
            ...state.userSlice,
            friends: friendsWithSpotify,
          },
        }));
      } catch (err) {
        console.error('Error loading Spotify-enhanced friends:', err);
      }
    },
  },
}));

export default useStore;
