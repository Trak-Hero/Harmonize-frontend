export default function MediaCard({ media }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 w-40 shrink-0 text-white text-sm">
      <img
        src={media.image}
        alt={media.name}
        className="w-full aspect-square rounded mb-2 object-cover"
      />
      <p className="font-semibold truncate">{media.name}</p>
      <p className="text-zinc-400 text-xs truncate">
        {media.artists?.join(', ') ?? 'Unknown Artist'}
      </p>
    </div>
  );
}
