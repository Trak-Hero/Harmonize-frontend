export default function FavoriteSongs() {
  return (
    <section className="rounded-xl bg-gradient-to-br from-pink-100/20 to-neutral-700/30 p-4">
      <h3 className="text-xl font-bold mb-2">Favorite Songs</h3>
      <div className="flex overflow-x-scroll space-x-4 pb-2">
        {/* Map over your real favorite songs here */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="min-w-[120px] h-[160px] rounded-lg bg-neutral-800 flex items-center justify-center text-sm">
            Song {i + 1}
          </div>
        ))}
      </div>
    </section>
  );
}