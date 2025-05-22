import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ArtistProfile.css';

export default function ArtistProfile() {
  const { id } = useParams();                       // Spotify artist ID
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const me = '682bf5ec57acfd1e97d85d8e';

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [isSpotifyArtist, setIsSpotifyArtist] = useState(false);

  const pick = (...urls) => urls.find(Boolean);

  /* ↓ leave your existing fallbackTracks / fallbackAlbums here */

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        // ---- 1️⃣  Always try Spotify route first ----
        let res   = await fetch(`${baseURL}/artists/spotify/${id}`);
        let data;

        if (res.ok) {
          data = await res.json();
          setIsSpotifyArtist(true);
        } else {
          // ---- 2️⃣  Fallback: try Mongo route ----
          res = await fetch(`${baseURL}/artists/${id}`);
          if (!res.ok) throw new Error('Artist not found in DB or Spotify');
          data = await res.json();
          setIsSpotifyArtist(false);
        }

        if (!data.topTracks?.length) data.topTracks = fallbackTracks;
        if (!data.albums?.length)    data.albums    = fallbackAlbums;

        setArtist(data);
        setEditedBio(data.bio || '');
        setFollowing((data.followers ?? []).includes(me));
      } catch (err) {
        console.error('[ArtistProfile] Fetch failed:', err.message || err);
        // keep artist as‑is; UI will still show previous state or fallback
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);


  const toggleFollow = async () => {
    if (isSpotifyArtist) return;
    try {
      const res = await fetch(`${baseURL}/artists/${id}/follow`, {
        method: 'PATCH'
      });
      if (!res.ok) throw new Error('Follow request failed');

      setFollowing(!following);
      setArtist(prev =>
        prev
          ? {
              ...prev,
              followers: following
                ? prev.followers.filter(f => f !== me)
                : [...(prev.followers ?? []), me]
            }
          : prev
      );
    } catch (err) {
      console.error(err);
      alert('Sorry, something went wrong when trying to update follow status.');
    }
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const startEditing = () => {
    if (isSpotifyArtist) return;
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedBio(artist.bio || '');
  };

  const saveBio = async () => {
    if (isSpotifyArtist) return;
    try {
      let success = false;

      try {
        const res = await fetch(`${baseURL}/artists/${id}/bio`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bio: editedBio })
        });
        success = res.ok;
      } catch {}

      if (!success) {
        try {
          const res = await fetch(`${baseURL}/artists/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bio: editedBio })
          });
          success = res.ok;
        } catch {}
      }

      if (success) {
        setArtist(prev => prev ? { ...prev, bio: editedBio } : prev);
        setIsEditing(false);
      } else {
        alert('Failed to save bio.');
      }

    } catch (err) {
      console.error(err);
      alert('Sorry, something went wrong when trying to save the bio.');
    }
  };

  if (loading) return <div className="loading">Loading…</div>;
  if (!artist) return <div className="loading">Artist not found</div>;

  const covers =
    artist.albums?.length
      ? artist.albums.slice(0, 4).map(a => ({
          id: a.id,
          name: a.name,
          cover: pick(a.images?.[0]?.url, a.cover),
          year: a.year || ''
        }))
      : artist.topTracks?.slice(0, 4).map(t => ({
          id: t.id,
          name: t.album?.name || 'Album',
          cover: pick(t.album?.images?.[0]?.url, '/fallback-cover.jpg'),
          year: ''
        })) ?? [];

  return (
    <div style={{ overflowY: 'auto', maxHeight: '100vh' }}>
      <div className="artist-page">
        {/* Left column */}
        <section className="artist-left">
          <div className="artist-name">{artist.artistName || artist.name}</div>
          <div className="follower-stats">
            {Array.isArray(artist.followers)
              ? `${artist.followers.length.toLocaleString()} Followers • — Following`
              : `${(artist.followers ?? 0).toLocaleString()} Spotify Followers`}
          </div>

          <div className="action-buttons">
            {!isSpotifyArtist && (
              <button className="btn-primary" onClick={toggleFollow}>
                {following ? 'Following' : 'Follow'}
              </button>
            )}
            <button className="btn-secondary" onClick={share}>
              {copied ? 'Copied!' : 'Share'}
            </button>
            {!isSpotifyArtist && (
              <button className="btn-secondary" onClick={startEditing}>
                Edit
              </button>
            )}
          </div>

          <img
            className="profile-photo"
            src={pick(artist.profilePic, '/fallback-cover.jpg')}
            alt={artist.artistName || artist.name}
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/260x260?text=No+Image';
            }}
          />
        </section>

        {/* Center column */}
        <section className="artist-main">
          {/* About */}
          <div className="about-card glass">
            <h2>About Me</h2>
            {isEditing ? (
              <div className="bio-edit-container">
                <textarea
                  className="bio-edit-textarea"
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="Write something about yourself..."
                  rows={6}
                />
                <div className="bio-edit-controls">
                  <button className="btn-primary" onClick={saveBio}>Save</button>
                  <button className="btn-secondary" onClick={cancelEditing}>Cancel</button>
                </div>
              </div>
            ) : (
              <p>{artist.bio || 'No bio yet'}</p>
            )}
          </div>

          {/* Popular Songs */}
          {!!artist.topTracks?.length && (
            <div className="songs-card glass">
              <h3>Most Popular Songs</h3>
              <div className="songs-grid">
                {artist.topTracks.slice(0, 5).map(t => (
                  <div key={t.id} className="track-row">
                    <img
                      className="thumb"
                      src={pick(t.album?.images?.[0]?.url, t.album?.cover, '/fallback-cover.jpg')}
                      alt=""
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/38x38?text=♪';
                      }}
                    />
                    <span className="track-name">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Albums */}
          {!!covers.length && (
            <div className="albums-section glass">
              <h3>Albums</h3>
              <div className="album-grid">
                {covers.map(alb => (
                  <div key={alb.id} className="album-item">
                    <img
                      className="album-cover"
                      src={alb.cover}
                      alt={alb.name}
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/140x140?text=Album';
                      }}
                    />
                    <div className="album-name">{alb.name}</div>
                    {alb.year && <div className="album-year">{alb.year}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right sidebar */}
        <aside className="friend-sidebar glass">
          <h3>Friend Activity</h3>
          <p className="subtitle">See what your friends are listening to</p>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="friend-row shimmer">
              <div className="avatar" />
              <div className="friend-lines">
                <div className="line w-24" />
                <div className="line w-16" />
              </div>
            </div>
          ))}
          <div className="sidebar-actions">
            <button className="btn-secondary">See all</button>
            <button className="btn-location">📍 Locations</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
