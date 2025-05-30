import { useState } from 'react';

const CreatePostForm = ({ spotifyAccessToken }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [cover, setCover] = useState('');
  const [audio, setAudio] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyAccessToken}`
      },
      body: JSON.stringify({
        title,
        artist,
        genre,
        cover,
        audio
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Post created!');
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Artist" value={artist} onChange={e => setArtist(e.target.value)} />
      <input placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
      <input placeholder="Cover URL" value={cover} onChange={e => setCover(e.target.value)} />
      <input placeholder="Audio URL" value={audio} onChange={e => setAudio(e.target.value)} />
      <button type="submit">Post</button>
    </form>
  );
};