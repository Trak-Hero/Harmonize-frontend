function Landing() {
    return (
        <div className="relative w-full h-full">
            <div className="relative z-20 flex items-center justify-center h-full text-4xl font-bold text-blue-500">
            Harmonize: Discover new artists and music
            </div>

            {/* transparent black overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />

            {/* looping background video */}
            <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
            <source src="/bg-video.mp4" type="video/mp4" />
            </video>
        </div>
    );
}

export default Landing;