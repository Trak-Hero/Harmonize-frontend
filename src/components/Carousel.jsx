// src/components/Carousel.jsx
import React from "react";

/**
 * A simple, horizontally scrollable carousel. All you need to do is pass:
 *
 *   <Carousel
 *     items={myArray}
 *     renderItem={item => <MyCard data={item} />}
 *   />
 *
 * It will lay out all cards (from items) in a single row, with a small
 * gap between them, and let the user scroll/drag horizontally. No auto-scroll.
 */
export default function Carousel({
  items = [],
  renderItem,
  gap = 16,          // space between each card (in px)
  hideScrollbar = true // if true, we hide the native scrollbar visually
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  if (typeof renderItem !== "function") {
    console.warn("Carousel: Missing renderItem function");
    return null;
  }

  return (
    // ① Outer wrapper with overflow-x-auto so the user can scroll horizontally.
    // ② We optionally hide the scrollbar with tailwind "scrollbar-none".
    <div
      className={`overflow-x-auto ${
        hideScrollbar ? "scrollbar-none" : ""
      } py-2`}
    >
      {/* 
        ③ Inner flex container lays out all items in one row.
        ④ We add “space-x-[gap]” to generate consistent horizontal spacing.
      */}
      <div className="flex items-center" style={{ gap: `${gap}px` }}>
        {items.map((item, idx) => (
          // ⑤ Each card must not shrink, so we give it flex-shrink-0.
          <div key={idx} className="flex-shrink-0">
            <div className="transition-transform duration-200 ease-in-out hover:scale-105">
              {renderItem(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
