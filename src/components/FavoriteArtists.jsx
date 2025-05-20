export default function FavoriteArtists() {
  return (
    <section className="rounded-xl bg-gradient-to-br from-teal-200/10 to-blue-200/10 p-4">
      <h3 className="text-lg font-semibold mb-2">Favorite Artists</h3>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg aspect-square bg-neutral-700 flex items-center justify-center">
            Artist {i + 1}
          </div>
        ))}
      </div>
    </section>
  );
}