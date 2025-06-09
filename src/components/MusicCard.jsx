import React, { useRef, useEffect, useState } from 'react';

const MusicCard = ({ item, isVisible, onLike, onUnlike, currentUser }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  // check if current user has liked this post
  useEffect(() => {
    if (currentUser && item.likedBy) {
      setIsLiked(item.likedBy.includes(currentUser._id || currentUser.id));
    }
  }, [currentUser, item.likedBy]);

  // update like count when item changes
  useEffect(() => {
    setLikeCount(item.likes || 0);
  }, [item.likes]);

  // auto-play the audio when card becomes visible
  useEffect(() => {
    if (audioRef.current && item.previewUrl && !audioError) {
      if (isVisible) {
        setAudioLoading(true);
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioLoading(false);
          })
          .catch((error) => {
            console.log('Auto-play prevented or failed:', error);
            setAudioLoading(false);
          });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        setAudioLoading(false);
      }
    }
  }, [isVisible, item.previewUrl, audioError]);

  const handlePlayPause = () => {
    if (!item.previewUrl) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setAudioLoading(true);
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAudioLoading(false);
            setAudioError(false); // reset error state on successful play
          })
          .catch((error) => {
            console.error('Play error:', error);
            setAudioLoading(false);
            setAudioError(true);
          });
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioError = () => {
    console.error('Audio error for track:', item.title);
    setAudioError(true);
    setIsPlaying(false);
    setAudioLoading(false);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPreviewStatus = () => {
    if (!item.previewUrl) return 'No preview available';
    if (audioError) return 'Preview unavailable';
    if (audioLoading) return 'Loading...';
    return '30s preview';
  };

  // function to get tooltip text based on device type
  const getSpotifyTooltip = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobile ? 'Open in Spotify app' : 'Open in Spotify web';
  };

  // function to open Spotify track in app or web
  const openSpotifyTrack = () => {
    if (!item.spotifyTrackId) {
      console.error('No Spotify track ID available');
      return;
    }

    // construct Spotify URL
    const spotifyUrl = `https://open.spotify.com/track/${item.spotifyTrackId}`;
    
    // open in Spotify app first (mobile), then fallback to web
    const spotifyAppUrl = `spotify:track:${item.spotifyTrackId}`;
    
    // temporary link to test if Spotify app is available
    const link = document.createElement('a');
    
    // for mobile devices, try the Spotify app protocol first
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Try to open in Spotify app
      window.location.href = spotifyAppUrl;
      
      // fallback to web version after a short delay if app didn't open
      setTimeout(() => {
        window.open(spotifyUrl, '_blank');
      }, 2000);
    } else {
      // for desktop, open in web browser
      window.open(spotifyUrl, '_blank');
    }
  };

  // function to open artist's Spotify page
  const openArtistSpotify = () => {
    if (!item.artist) {
      console.error('No artist information available');
      return;
    }

    // construct search URL for the artist on Spotify
    const artistSearchUrl = `https://open.spotify.com/search/${encodeURIComponent(item.artist)}/artists`;
    
    // for mobile devices, try the Spotify app protocol first
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Try to open in Spotify app using search
      const spotifyAppUrl = `spotify:search:${encodeURIComponent(item.artist)}`;
      window.location.href = spotifyAppUrl;
      
      // fallback to web version after a short delay if app didn't open
      setTimeout(() => {
        window.open(artistSearchUrl, '_blank');
      }, 2000);
    } else {
      // for desktop, open in web browser
      window.open(artistSearchUrl, '_blank');
    }
  };

  // function to handle like/unlike action
  const handleLike = async () => {
    if (!currentUser || isLiking) return;

    setIsLiking(true);
    try {
      if (isLiked) {
        // Unlike the post
        if (onUnlike) {
          await onUnlike(item._id);
        }
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // Like the post
        if (onLike) {
          await onLike(item._id);
        }
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // revert the optimistic update on error
      setIsLiked(!isLiked);
      setLikeCount(item.likes || 0);
    } finally {
      setIsLiking(false);
    }
  };

  // function to handle sharing the song
  const handleShare = async () => {
    const shareData = {
      title: `${item.title} by ${item.artist}`,
      text: `Check out this song: ${item.title} by ${item.artist}`,
      url: `https://open.spotify.com/track/${item.spotifyTrackId}`
    };

    try {
      // check if Web Share API is supported (mainly on mobile)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // fallback: copy to clipboard
        const textToCopy = `Check out "${item.title}" by ${item.artist} on Spotify: https://open.spotify.com/track/${item.spotifyTrackId}`;
        
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(textToCopy);
          // show a toast notification here
          alert('Link copied to clipboard!');
        } else {
          // fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={item.coverUrl}
          alt={item.title}
          className="w-full h-[500px] object-cover"
        />
        
        {/* Play/Pause Overlay */}
        {item.previewUrl && !audioError && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handlePlayPause}
          >
            <div className="bg-white bg-opacity-90 rounded-full p-4">
              {audioLoading ? (
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between min-h-[200px]">
        <div>
          <h2 className="text-2xl font-bold">{item.title}</h2>
          <p className="text-sm text-gray-400">
            {item.artist} {item.genre ? `· ${item.genre}` : ''}
          </p>
          {item.duration && (
            <p className="text-xs text-gray-500 mt-1">
              Duration: {Math.floor(item.duration / 60)}:
              {('0' + Math.floor(item.duration % 60)).slice(-2)}
            </p>
          )}
          
          {/* Caption Section */}
          {item.caption && (
            <div className="mt-3 p-3 bg-neutral-800 rounded-lg">
              <p className="text-sm text-gray-300 leading-relaxed">
                {item.caption}
              </p>
            </div>
          )}
        </div>

        {/* Hidden Audio Element for Auto-play */}
        {item.previewUrl && !audioError && (
          <audio
            ref={audioRef}
            onEnded={handleAudioEnd}
            onError={handleAudioError}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            preload="metadata"
          >
            <source src={item.previewUrl} type="audio/mpeg" />
          </audio>
        )}

        {/* Audio Controls (visible) */}
        {item.previewUrl && !audioError ? (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                disabled={audioLoading}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  audioLoading 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {audioLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play Preview'}
              </button>
              <span className="text-xs text-gray-400">{getPreviewStatus()}</span>
            </div>

            {/* Progress bar */}
            {duration > 0 && (
              <div className="mt-3 flex items-center space-x-2 text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-white h-1 rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <span>{formatTime(duration)}</span>
              </div>
                )}
              </div>
            ) : (
              <div className="mt-2">
                <span className="text-xs text-gray-500">{getPreviewStatus()}</span>
              </div>
            )}
        

        {/* Action Buttons */}
        <div className="flex justify-between mt-4 text-gray-300 text-sm">
          {/* Spotify button with tooltip */}
          <div className="relative">
            <button 
              onClick={openSpotifyTrack}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="hover:text-green-500 transition flex items-center space-x-1"
              title={getSpotifyTooltip()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span>Spotify</span>
            </button>
            
            {/* tooltip */}
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                {getSpotifyTooltip()}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
              </div>
            )}
          </div>

          {/* Follow artist button */}
          <button 
            onClick={openArtistSpotify}
            className="hover:text-pink-400 transition">
              Follow artist
          </button>

          {/* Like button */}
          <button 
            onClick={handleLike}
            disabled={!currentUser || isLiking}
            className={`hover:text-red-400 transition flex items-center space-x-1 ${
              isLiked ? 'text-red-500' : 'text-gray-300'
            } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg 
              className="w-4 h-4" 
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <span>{isLiking ? '...' : likeCount}</span>
          </button>

          {/* Share button */}
          <button 
            onClick={handleShare}
            className="hover:text-blue-400 transition flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default MusicCard;