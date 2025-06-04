import React, { useRef, useEffect, useState } from 'react';

const MusicCard = ({ item, isVisible }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

      <div className="p-4 flex flex-col justify-between h-[200px]">
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
              <div className="flex items-center space-x-2 text-xs text-gray-400">
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
          <button className="hover:text-pink-400 transition">Add to playlist</button>
          <button className="hover:text-pink-400 transition">Follow artist</button>
          <button className="hover:text-blue-400 transition">Comment</button>
          <button className="hover:text-green-400 transition">Share</button>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;