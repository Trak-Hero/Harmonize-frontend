import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ArtistProfile.css';

export default function ArtistProfile() {
  const { id } = useParams();
  const baseURL = 'http://localhost:8080';
  const me = '682bf5ec57acfd1e97d85d8e';

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  const pick = (...urls) => urls.find(Boolean);

  const fallbackTracks = [
    {
      id: '1',
      name: 'The Less I Know the Better',
      popularity: 88,
      album: { name: 'Currents', images: [{ url: '/fallback-cover.jpg' }] }
    },
    {
      id: '2',
      name: 'Feels Like We Only Go Backwards',
      popularity: 85,
      album: { name: 'Lonerism', images: [{ url: '/fallback-cover.jpg' }] }
    }
  ];
  const fallbackAlbums = [
    { id: 'c1', name: 'Currents', cover: '/fallback-album.jpg', year: 2015 },
    { id: 'c2', name: 'Lonerism', cover: '/fallback-album.jpg', year: 2012 }
  ];

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${baseURL}/artists/${id}`);
        if (!res.ok) throw new Error('Artist not found');
        const a = await res.json();

        if (!a.topTracks?.length) a.topTracks = fallbackTracks;
        if (!a.albums?.length) a.albums = fallbackAlbums;

        setArtist(a);
        setFollowing((a.followers ?? []).includes(me));
      } catch (err) {
        console.error(err);
        setArtist(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const toggleFollow = async () => {
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
          <div className="artist-name">{artist.artistName}</div>
          <div className="follower-stats">
            {(artist.followers?.length ?? 0).toLocaleString()} Followers • — Following
          </div>

          <div className="action-buttons">
            <button className="btn-primary" onClick={toggleFollow}>
              {following ? 'Following' : 'Follow'}
            </button>
            <button className="btn-secondary" onClick={share}>
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>

          <img
            className="profile-photo"
            src={pick(artist.profilePic, '/fallback-cover.jpg')}
            alt={artist.artistName}
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
            <p>{artist.bio || 'No bio yet'}</p>
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
                    src={pick(
                      t.album?.images?.[0]?.url,
                      t.album?.cover,
                      '/fallback-cover.jpg'
                    )}
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
