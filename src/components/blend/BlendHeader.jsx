import { useState, useEffect } from 'react';

export default function BlendHeader({ selectedUser }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); 

    return () => clearTimeout(timer);
  }, []);

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
      <h1 className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none transition-all duration-1200 ease-out delay-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        Blend Mode
      </h1>

      <p className={`text-xl italic text-gray-300 transition-all duration-1000 ease-out delay-400 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        {selectedUser ? (
          <>
            Your taste vs <span className="font-semibold text-white underline underline-offset-4">{selectedUser.displayName}</span>
          </>
        ) : (
          <>
            See how similar your taste is to your friends
          </>
        )}
      </p>
    </div>
  );
}