import { create } from 'zustand';

const useLocationStore = create((set) => ({
  userLocation: null,
  locationError: null,
  locationLoaded: false,

  setUserLocation: ({ latitude, longitude }) => {
    set({ userLocation: { latitude, longitude }, locationLoaded: true }); 
  },

  fetchUserLocation: () => {
    if (!navigator.geolocation) {
      set({ locationError: 'Geolocation not supported', locationLoaded: true });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        set({ userLocation: { latitude, longitude }, locationLoaded: true });
      },
      (err) => {
        set({ locationError: err.message, locationLoaded: true }); 
        console.error('Geolocation error:', err);
      }
    );
  },
}));

export default useLocationStore;
