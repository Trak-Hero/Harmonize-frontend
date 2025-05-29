import { create } from 'zustand';

const mockUser = {
  id: '12345',
  name: 'Lena VC',
  email: 'lena@example.com',
};

export const useAuthStore = create((set) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

  const initialUser = storedUser || null; // Start with null if no stored user

  return {
    user: initialUser,

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