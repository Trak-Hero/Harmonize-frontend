import { create } from 'zustand';

export const useAuthStore = create((set) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));

  return {
    user: storedUser || null,

    login: (userData) => {
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
