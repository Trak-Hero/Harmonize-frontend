export default function MediaCard({ media }) {
  if (!media || !media.name) return null;

  return (
    <div className="bg-white/10 rounded-lg p-4 shadow-md">
      <img
        src={media.image || '/placeholder.jpg'}
        alt={media.name}
        className="w-full h-40 object-cover rounded-md mb-2"
      />
      <h3 className="text-white text-lg font-bold truncate">{media.name}</h3>
      {media.artists && (
        <p className="text-white/70 text-sm truncate">
          {media.artists.join(', ')}
        </p>
      )}
    </div>
  );
}
