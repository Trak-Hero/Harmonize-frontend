import { useEffect } from 'react';

export default function ConnectSpotify() {
  useEffect(() => {
    // kick off OAuth as soon as the page mounts
    window.location.href =
      `${import.meta.env.VITE_API_BASE_URL}/auth/spotify/login`;
  }, []);

  return (
    <div className="h-full flex items-center justify-center text-xl text-white">
      Redirecting you to Spotify&hellip;
    </div>
  );
}
