// src/components/Carousel.jsx
import React from "react";

/*
  A continuously looping (marquee) carousel. Usage:

    <Carousel
      items={myArray}
      renderItem={(item) => (
        <div className="w-40 h-40 rounded-lg overflow-hidden">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
      )}
      speed={20}    // optional: how many seconds it takes to scroll through one copy
      gap={16}      // optional: horizontal gap (in pixels) between each item
    />

  The carousel duplicates the `items` array, lays them out in a single long row,
  then animates it to the left. When the first half has scrolled out of view, the second half
  takes its place, creating a seamless “infinite loop” effect.
*/

export default function Carousel({
  items = [],
  renderItem,
  speed = 20,  // total seconds to scroll ONE full copy of items
  gap = 16     // horizontal gap in px between each rendered card
}) {
  if (!Array.isArray(items) || items.length === 0) return null;
  if (typeof renderItem !== "function") return null;

  // We’ll render items.concat(items) so that once the first N items scroll past,
  // the second N items immediately follow, making a seamless loop.

  // Inline CSS keyframes must be injected once; we’ll do it by rendering a <style> tag
  // at the top of this component. The animation is named “marquee-scroll”.
  //
  // Explanation of @keyframes marquee-scroll:
  //   0%   → translateX(0)            (start: show the first copy)
  //   100% → translateX(-50%)         (end: moved left by exactly half of the entire strip,
  //                                     revealing the second copy in the same position)
  //
  // Because our flex container contains items.concat(items), its full width is “100%”
  // (both copies back-to-back). By shifting left “50%,” we have slid exactly past the first
  // copy and landed cleanly at the start of the second copy. Because we loop infinitely,
  // it appears as if the items roll on forever.

  const marqueeAnimationName = "marquee-scroll";

  return (
    <>
      {/* ─────────── Inject global keyframes ─────────── */}
      <style key="carousel-styles">{`
        @keyframes ${marqueeAnimationName} {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* ─────────── Carousel wrapper ─────────── */}
      <div className="relative w-full overflow-x-hidden overflow-y-visible">
        {/* 
          ① The “track” is a flex container whose contents are [ items, items ] concatenated.
          ② We apply the marquee animation directly to this flex container:
                 animation: marquee-scroll <speed>s linear infinite;

          ③ Each “card” inside the track has margin-right = {gap}px, so that when cloned,
              there’s consistent spacing. Finally, we use flex-shrink-0 to prevent cards from
              collapsing in width.
        */}
        {/* Left gradient overlay */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent" />

        {/* Right gradient overlay */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent" />

        <div
          className="flex flex-nowrap items-center px-4"
          style={{
            animation: `${marqueeAnimationName} ${speed}s linear infinite`
          }}
        >
          {items.concat(items).map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0"
              style={{ marginRight: `${gap}px` }}
            >

              <div className="transition-transform duration-200 ease-in-out hover:scale-105">
                {renderItem(item)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
