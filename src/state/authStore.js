// src/state/authStore.js
import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const useAuthStore = create((set) => {
  // 1) On initialization, try to read "user" from localStorage:
  const stored = localStorage.getItem('user');
  const parsedUser = stored ? JSON.parse(stored) : null;

  return {
    user: parsedUser, // either the object or null

    //
    // ─────── Actions ───────
    //

    // 2) Call this on App mount to re‐validate the session server‐side.
    //    If /me returns 200, it stores & sets user. If 401, it clears both.
    fetchUser: async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          method: 'GET',
          credentials: 'include', // send cookies (if you use them)
        });
        if (!res.ok) {
          // e.g. 401 Unauthorized
          throw new Error(`Status ${res.status}`);
        }
        const userData = await res.json();
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData });
      } catch (err) {
        console.error('[authStore] fetchUser failed:', err);
        localStorage.removeItem('user');
        set({ user: null });
      }
    },

    // 3) Call this right after a successful POST /auth/login (with credentials: 'include').
    //    It writes to both Zustand state and localStorage.
    login: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
    },

    // 4) Call this on click “Log Out”: clears both localStorage + in‐memory state.
    logout: () => {
      localStorage.removeItem('user');
      set({ user: null });
    },

    // 5) (Optional) If you ever need to update only certain fields of user:
    updateUser: (updates) =>
      set((state) => {
        const updated = { ...state.user, ...updates };
        localStorage.setItem('user', JSON.stringify(updated));
        return { user: updated };
      }),
  };
});
