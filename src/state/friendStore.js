import { create } from 'zustand';

const normalize = (u) => ({
  ...u,
  id:  String(u._id ?? u.id),
  _id: String(u._id ?? u.id),
});

const upsert = (arr, user) => {
  const u   = normalize(user);
  const idx = arr.findIndex((f) => String(f._id ?? f.id) === u._id);
  if (idx === -1) return [...arr, u];
  const copy = arr.slice();
  copy[idx]  = u;
  return copy;
};

const useFriendStore = create((set, get) => ({
  userSlice: {
    currentUserId: null,
    friends: [],

    followUser: async (friendId) => {
      const API = import.meta.env.VITE_API_BASE_URL;
      try {
        const res = await fetch(`${API}/api/friends/follow/${friendId}`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) return;

        const { current, target } = await res.json();

        set((s) => ({
          userSlice: {
            ...s.userSlice,
            friends: upsert(upsert(s.userSlice.friends, current), target),
          },
        }));
      } catch (err) {
        console.error('[followUser]', err);
      }
    },

    unfollowUser: async (friendId) => {
      const API = import.meta.env.VITE_API_BASE_URL;
      try {
        const res = await fetch(`${API}/api/friends/follow/${friendId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) return;

        const { current, target } = await res.json();

        set((s) => ({
          userSlice: {
            ...s.userSlice,
            friends: upsert(upsert(s.userSlice.friends, current), target),
          },
        }));
      } catch (err) {
        console.error('[unfollowUser]', err);
      }
    },
  },
}));

export default useFriendStore;
