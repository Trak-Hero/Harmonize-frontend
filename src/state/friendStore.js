
import create from 'zustand';
const useFriendStore = create((set, get) => ({
  userSlice: {
    currentUserId: null,
    friends: [],

    followUser: async (friendId) => {
      const API = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API}/api/friends/follow/${friendId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) return;
      const { current, target } = await res.json();
      set((s) => ({
        userSlice: {
          ...s.userSlice,
          friends: s.userSlice.friends.map((u) => {
            if (u._id === current._id) return current;
            if (u._id === target._id)  return target;
            return u;
          }),
        },
      }));
    },
    
    unfollowUser: async (friendId) => {
      const API = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API}/api/friends/follow/${friendId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) return;
      const { current, target } = await res.json();
      set((s) => ({
        userSlice: {
          ...s.userSlice,
          friends: s.userSlice.friends.map((u) => {
            if (u._id === current._id) return current;
            if (u._id === target._id)  return target;
            return u;
          }),
        },
      }));
    },
  },
}));
