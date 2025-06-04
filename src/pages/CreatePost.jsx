import { useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    spotifyTrackId: '',
    title: '',
    artist: '',
    genre: '',
    coverUrl: '',
    previewUrl:'',
    duration: null,
    caption: '',
  });

  const [isPreviewing, setIsPreviewing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSpotifySearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(`${API}/api/musicPosts/spotify/search?q=${encodeURIComponent(searchQuery)}&type=track`, {
        method: 'GET',
        credentials: 'include', // include session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Search results:', data);
      
      // Debug: Log preview URLs
      data.forEach((track, index) => {
        console.log(`Track ${index + 1}:`, {
          name: track.name,
          artist: track.artists?.[0]?.name,
          preview_url: track.preview_url || 'No preview available',
          hasPreview: !!track.preview_url
        });
      });

      setSearchResults(data || []);
    } catch (err) {
      console.error('Spotify Search Error:', err);
      alert('Failed to search Spotify. Please try again.');
    } finally {
    setIsSearching(false);
  }
  };

  const handleTrackSelect = (track) => {
    console.log('Selected track:', {
      id: track.id,
      name: track.name,
      artist: track.artists?.[0]?.name,
      preview_url: track.preview_url,
      album_cover: track.album?.images?.[0]?.url,
      duration_ms: track.duration_ms
    });

    setFormData((prev) => ({
      ...prev,
      spotifyTrackId: track.id,
      title: track.name,
      artist: track.artists?.[0]?.name || '',
      previewUrl: track.preview_url || '', // This might be null
      coverUrl: track.album?.images?.[0]?.url || '',
      duration: track.duration_ms ? track.duration_ms / 1000 : null,
    }));
    
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);

    // validate required fields
    if (!formData.spotifyTrackId || !formData.title || !formData.artist) {
      alert('Please select a track from Spotify search');
      return;
    }

    try {
      const response = await fetch(`${API}/api/musicPosts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (!response.ok) throw new Error('Failed to create post');

      alert('Post created successfully!');

      // reset form data
      setFormData({
        spotifyTrackId: '',
        title: '',
        artist: '',
        genre: '',
        coverUrl: '',
        previewUrl:'',
        duration: null,
        caption: '',
      });
      setIsPreviewing(false);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  const togglePreview = () => setIsPreviewing(!isPreviewing);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center px-4">
      {!isPreviewing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (formData.spotifyTrackId) {
              togglePreview();
            } else {
              alert('Please select a track first');
            }
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
              onKeyPress={(e) => e.key === 'Enter' && handleSpotifySearch()}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleSpotifySearch}
              disabled={isSearching || !searchQuery.trim()}
              className={`w-full py-1 rounded ${
                isSearching || !searchQuery.trim()
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white transition`}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border border-gray-700 rounded">
              {searchResults.map((track) => (
                <div
                key={track.id}
                onClick={() => handleTrackSelect(track)}
                className="bg-gray-800 p-3 cursor-pointer hover:bg-gray-700 transition"
              >
                <div className="flex items-center space-x-3">
                  {track.album?.images?.[2]?.url && (
                    <img 
                      src={track.album.images[2].url} 
                      alt={track.name}
                      className="w-12 h-12 rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold truncate">{track.name}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {track.artists?.[0]?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {track.preview_url ? 'Preview available' : 'No preview'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            readOnly
            className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
          />

          <div className="w-full px-3 py-2 rounded bg-gray-800 text-white">
            <label className="block text-sm text-gray-400 mb-1">Artist</label>
            <p>{formData.artist || 'Artist will appear here'}</p>
          </div>

          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white"
          >
            <option value="">Select Genre</option>
            <option value="Pop">Pop</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="R&B">R&B</option>
            <option value="Electronic">Electronic</option>
            <option value="Indie">Indie</option>
            <option value="Rock">Rock</option>
            <option value="Jazz">Jazz</option>
            <option value="Classical">Classical</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="coverUrl"
            placeholder="Cover Image URL"
            value={formData.coverUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
          />

          <textarea
            name="caption"
            placeholder="Add a caption..."
            value={formData.caption}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 resize-none"
          />

          {/* show preview availability */}
          {formData.spotifyTrackId && (
            <div className="text-sm p-2 rounded bg-gray-800">
              <p className="text-gray-300">Selected: {formData.title}</p>
              <p className="text-gray-400">
                Preview: {formData.previewUrl ? 'Available' : 'Not available'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!formData.spotifyTrackId}
            className={`w-full bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition ${
              formData.spotifyTrackId
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Preview Post
          </button>
        </form>
      ) : (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-lg space-y-4">
          <h2 className="text-2xl font-bold text-center">Preview</h2>

          {formData.coverUrl ? (
            <img src={formData.coverUrl} alt="Cover" className="rounded-lg w-full" />
          ) : (
            <div className="w-full h-64 bg-gray-700 flex items-center justify-center rounded-lg">
            <span className="text-gray-400">No cover image</span>
          </div>
        )}

          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{formData.title || 'Untitled'}</h3>
            <p className="text-gray-300">{formData.artist}</p>
            <p className="text-sm text-gray-400">{formData.genre}</p>
            {formData.duration && (
              <p className="text-sm text-gray-500">
                Duration: {Math.floor(formData.duration / 60)}:
                {('0' + Math.floor(formData.duration % 60)).slice(-2)} min
              </p>
            )}
          </div>

          {formData.previewUrl ? (
            <div className="space-y-2">
              <p className="text-sm text-green-400">Preview available</p>
              <audio controls className="w-full">
                <source src={formData.previewUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <p className="text-sm text-yellow-400">No preview available for this track</p>
          )}

          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={() => setIsPreviewing(false)}
              className="w-1/2 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition"
            >
              Edit
            </button>
            <button
              onClick={handleSubmit}
              className="w-1/2 bg-white text-black hover:bg-gray-200 py-2 px-4 rounded transition"
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