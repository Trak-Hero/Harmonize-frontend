import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export const useAuthStore = create((set) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

  return {
    user: storedUser || null,

    fetchUser: async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status}`);
        }

        const userData = await res.json();
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData });
      } catch (err) {
        console.error('Error loading user session:', err);
        localStorage.removeItem('user');
        set({ user: null });
      }
    },

    login: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
    },

    setUser: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
    },

    logout: () => {
      localStorage.removeItem('user');
      set({ user: null });
    },

    updateUser: (updates) =>
      set((state) => {
        const updated = { ...state.user, ...updates };
        localStorage.setItem('user', JSON.stringify(updated));
        return { user: updated };
      }),
  };
});
