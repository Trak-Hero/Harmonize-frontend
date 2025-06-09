import React from "react";



export default function Carousel({
  items = [],
  renderItem,
  speed = 20,  
  gap = 16    
}) {
  if (!Array.isArray(items) || items.length === 0) return null;
  if (typeof renderItem !== "function") return null;

  const marqueeAnimationName = "marquee-scroll";

  return (
    <>
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

      <div className="relative w-full overflow-x-hidden overflow-y-visible">
       
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent" />

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
