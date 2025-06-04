// src/components/blend/BlendHeader.jsx - Updated version
export default function BlendHeader({ selectedUser }) {
  return (
    <div className="w-full flex flex-col items-start text-left space-y-2">
      {/* Title */}
      <h1 className="text-5xl sm:text-[8rem] md:text-[10rem] font-extrabold tracking-tight leading-none">
        BLEND MODE
      </h1>

      {/* Subtitle */}
      <p className="text-3xl italic text-gray-300">
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