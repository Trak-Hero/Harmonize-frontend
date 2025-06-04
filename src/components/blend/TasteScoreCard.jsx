export default function TasteScoreCard({ score, userA, userB }) {
  return (
    <div className="relative w-full max-w-3xl mx-auto mt-4">
      {/* Left user bubble */}
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 z-20 px-6 py-2 rounded-2xl text-white text-2xl font-serif font-semibold shadow-inner border border-gray-300 bg-gradient-to-br from-[#2d2d2d] to-[#555] backdrop-blur-md">
        {userA.name}
      </div>

      {/* Right user bubble */}
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 z-20 px-6 py-2 rounded-2xl text-white text-2xl font-serif font-semibold shadow-inner border border-gray-300 bg-gradient-to-br from-[#2d2d2d] to-[#555] backdrop-blur-md">
        {userB.name}
      </div>

      {/* Score card with background image */}
      <div
        className="relative z-10 rounded-2xl px-10 py-14 text-center shadow-2xl bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('../blend_bg.png')",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl z-10"></div>

        <div className="relative text-white text-[6rem] font-extrabold leading-none z-20">
          {score}%
        </div>
        <div className="relative mt-2 text-white text-2xl font-light z-20">
          Taste Match
        </div>
      </div>
    </div>
  );
}
