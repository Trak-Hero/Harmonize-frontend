// src/state/authStore.js
import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export const useAuthStore = create((set) => {
  // On initialization, try to read `user` from localStorage.
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

  return {
    // If there was a stored user, seed the state with it. Otherwise, user = null.
    user: storedUser || null,

    // ============================
    // 1) fetchUser(): on app load, confirm with backend
    // ============================
    fetchUser: async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          method: 'GET',
          credentials: 'include', // send cookies
        });
        if (!res.ok) {
          // e.g. 401 Unauthorized => session expired
          throw new Error(`Failed to fetch user: ${res.status}`);
        }
        const userData = await res.json();
        // Save to localStorage + store
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData });
      } catch (err) {
        console.error('Error loading user session:', err);
        localStorage.removeItem('user');
        set({ user: null });
      }
    },

    // ============================
    // 2) login(): call after successful login, write to localStorage + store
    // ============================
    login: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
    },

    // ============================
    // 3) setUser(): alias for updating user manually
    // ============================
    setUser: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
    },

    // ============================
    // 4) logout(): clear localStorage + store, optionally call backend logout
    // ============================
    logout: () => {
      localStorage.removeItem('user');
      set({ user: null });
      // If your backend has a logout endpoint, call it to clear cookies on server:
      try {
        fetch(`${API_BASE}/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        console.warn('Error calling logout endpoint:', err);
      }
    },

    // ============================
    // 5) updateUser(): merge updates into current user object
    // ============================
    updateUser: (updates) =>
      set((state) => {
        const updated = { ...state.user, ...updates };
        localStorage.setItem('user', JSON.stringify(updated));
        return { user: updated };
      }),
  };
});
