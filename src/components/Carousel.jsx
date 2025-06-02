export default function Carousel({ items = [], renderItem, title }) {
  if (!items.length) return null;

  return (
    <section className="mb-8">
      {title && (
        <h2 className="text-xl font-bold text-white mb-3 px-1">{title}</h2>
      )}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-1">
        {items.map((item, i) => (
          <div key={i} className="shrink-0">{renderItem(item)}</div>
        ))}
      </div>
    </section>
  );
}
