const MusicCard = ({ item }) => {
    return (
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-lg overflow-hidden flex flex-col">
        {/* looping video preview, image fallback */}
        {item.video ? (
            <video
            src={item.video}
            className="w-full h-[500px] object-cover"
            autoPlay
            loop
            muted
            playsInline
            />
        ) : (
            <img
            src={item.cover}
            alt={item.title}
            className="w-full h-[500px] object-cover"
            />
        )}
  
        <div className="p-4 flex flex-col justify-between h-[200px]">
          <div>
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <p className="text-sm text-gray-400">{item.artist} · {item.genre}</p>
          </div>

            {/* option audio preview */}
            {item.audio && (
            <audio controls className="mt-2 w-full">
                <source src={item.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            )}

          {/* buttons */}
          <div className="flex justify-between mt-4 text-gray-300">
            <button className="hover:text-pink-400">Add to playlist</button>
            <button className="hover:text-pink-400">Follow artist</button>
            <button className="hover:text-blue-400">Comment</button>
            <button className="hover:text-green-400">Share</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default MusicCard;