import React, { useEffect, useState } from 'react';

export default function TasteScoreCard({ score, userA, userB }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [pop, setPop] = useState(false);
  const [bubblesVisible, setBubblesVisible] = useState(false);

  useEffect(() => {
    const bubbleTimer = setTimeout(() => {
      setBubblesVisible(true);
    }, 200);

    const scoreTimer = setTimeout(() => {
      let start = 0;
      const duration = 1000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * score);
        setAnimatedScore(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setPop(true);
          setTimeout(() => setPop(false), 300);
        }
      };

      requestAnimationFrame(animate);
    }, 800);

    return () => {
      clearTimeout(bubbleTimer);
      clearTimeout(scoreTimer);
    };
  }, [score]);

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-4">
      <div 
        className={`absolute -left-24 top-1/2 -translate-y-1/2 z-20 px-6 py-2 rounded-2xl text-white text-2xl font-serif font-semibold shadow-inner border border-gray-300 bg-gradient-to-br from-[#2d2d2d] to-[#555] backdrop-blur-md transition-all duration-700 ease-out ${
          bubblesVisible 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-12'
        }`}
        style={{
          animationDelay: '0ms'
        }}
      >
        {userA.name}
      </div>

      <div 
        className={`absolute -right-24 top-1/2 -translate-y-1/2 z-20 px-6 py-2 rounded-2xl text-white text-2xl font-serif font-semibold shadow-inner border border-gray-300 bg-gradient-to-br from-[#2d2d2d] to-[#555] backdrop-blur-md transition-all duration-700 ease-out ${
          bubblesVisible 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-12'
        }`}
        style={{
          animationDelay: '100ms'
        }}
      >
        {userB.name}
      </div>

      <div
        className={`relative z-10 rounded-2xl px-10 py-14 text-center shadow-2xl bg-cover bg-center bg-no-repeat transition-all duration-500 ease-out ${
          bubblesVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
        style={{
          backgroundImage: "url('../blend_bg.png')",
          transitionDelay: '400ms'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl z-10"></div>

        <div
          className={`relative text-white text-[6rem] font-extrabold leading-none z-20 transition-transform duration-300 ${
            pop ? 'scale-110' : 'scale-100'
          }`}
        >
          {animatedScore}%
        </div>

        <div className="relative mt-2 text-white text-2xl font-light z-20">
          Taste Match
        </div>
      </div>
    </div>
  );
}