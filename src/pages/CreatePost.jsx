import { useState } from 'react';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    audioUrl: '',
    coverUrl: '',
    videoUrl: '',
  });

  const [isPreviewing, setIsPreviewing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSpotifySearch = async () => {
    if (!searchQuery.trim()) return;
  
    try {
      const res = await fetch(`/api/search/spotify?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.tracks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/musicPosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include Spotify or app access token if needed
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create post');

      alert('Post created!');
      setFormData({
        title: '',
        artist: '',
        genre: '',
        audioUrl: '',
        coverUrl: '',
        videoUrl: '',
      });
      setIsPreviewing(false);
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  const togglePreview = () => {
    setIsPreviewing(!isPreviewing);
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center px-4">
      {!isPreviewing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            togglePreview();
          }}
          className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Create a New Post</h2>

          <div className="space-y-2">
            <input
                type="text"
                placeholder="Search a song on Spotify"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
            />
            <button
                type="button"
                onClick={handleSpotifySearch}
                className="w-full bg-indigo-500 text-white py-1 rounded hover:bg-indigo-600"
            >
                Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((track) => (
                <div
                    key={track.id}
                    onClick={() => {
                    setFormData({
                        ...formData,
                        title: track.name,
                        artist: track.artist,
                        audioUrl: track.preview_url,
                        coverUrl: track.cover,
                        duration: track.duration_ms / 1000,
                    });
                    setSearchResults([]);
                    setSearchQuery('');
                    }}
                    className="bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700"
                >
                    <p className="font-semibold">{track.name}</p>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                </div>
                ))}
            </div>
            )}

          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="artist"
            placeholder="Artist"
            value={formData.artist}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
          />

          <input
            name="coverUrl"
            placeholder="Cover Image URL"
            value={formData.coverUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
          />

          <input
            name="videoUrl"
            placeholder="Optional Video URL"
            value={formData.videoUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition"
          >
            Preview Post
          </button>
        </form>
      ) : (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-lg space-y-4">
          <h2 className="text-2xl font-bold text-center">Preview</h2>
          {formData.videoUrl ? (
            <video src={formData.videoUrl} controls className="rounded-lg w-full" />
          ) : formData.coverUrl ? (
            <img src={formData.coverUrl} alt="Cover" className="rounded-lg w-full" />
          ) : (
            <div className="w-full h-64 bg-gray-700 flex items-center justify-center rounded-lg">
              <span className="text-gray-400">No media provided</span>
            </div>
          )}

          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{formData.title || 'Untitled'}</h3>
            <p className="text-gray-300">{formData.artist}</p>
            <p className="text-sm text-gray-400">{formData.genre}</p>
          </div>

          {formData.audioUrl && (
            <audio controls className="w-full mt-4">
              <source src={formData.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={() => setIsPreviewing(false)}
              className="w-1/2 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleSubmit}
              className="w-1/2 bg-white text-black hover:bg-gray-200 py-2 px-4 rounded"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;