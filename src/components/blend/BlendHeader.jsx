import { useState, useEffect } from 'react';

export default function BlendHeader({ selectedUser }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Small delay to ensure smooth animation

    return () => clearTimeout(timer);
  }, []);

  // Re-trigger animation when selectedUser changes
  useEffect(() => {
    if (selectedUser !== undefined) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedUser]);

  return (
    <div className={`w-full flex flex-col items-start text-left space-y-2 transition-all duration-1000 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Title */}
      <h1 className={`text-5xl sm:text-[8rem] md:text-[10rem] font-extrabold tracking-tight leading-none transition-all duration-1200 ease-out delay-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        BLEND MODE
      </h1>

      {/* Subtitle */}
      <p className={`text-3xl italic text-gray-300 transition-all duration-1000 ease-out delay-400 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        {selectedUser ? (
          <>
            Your taste vs <span className="font-semibold text-white underline underline-offset-4">{selectedUser.displayName}</span>
          </>
        ) : (
          <>
            These are <span className="font-semibold text-white underline underline-offset-4">our</span> tastes
          </>
        )}
      </p>
    </div>
  );
}