import { useEffect } from "react";

export default function ConnectSpotify() {
  useEffect(() => {
    const backendBaseUrl =
      import.meta.env.MODE === "development"
        ? "http://127.0.0.1:8080"
        : "https://project-music-and-memories-api-09tv.onrender.com"; // ✅ fixed URL

    window.location.href = `${backendBaseUrl}/auth/spotify/login`;
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Redirecting to Spotify …
    </div>
  );
}
