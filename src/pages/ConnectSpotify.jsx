// ConnectSpotify.jsx
import { useEffect } from "react";

export default function ConnectSpotify() {
  useEffect(() => {
    window.location.href = "http://127.0.0.1:8080/auth/spotify/login";
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Redirecting to Spotify …
    </div>
  );
}
