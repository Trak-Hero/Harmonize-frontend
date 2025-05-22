import MusicCard from '../components/MusicCard';
import midnightCityCover from '../assets/covers/midnight-city.jpg';
import midnightCityVideo from '../assets/videos/midnight-city-video.mp4';
import dreamsCover from '../assets/covers/dreams.png';
import blindingLightsCover from '../assets/covers/blinding-lights.png';
import takeOnMeCover from '../assets/covers/take-on-me.png';

const dummyFeed = [
  {
    id: 1,
    title: "Midnight City",
    artist: "M83",
    genre: "Synthpop",
    cover: midnightCityCover,
    audio: "/audio/midnight-city.mp3",
    video: midnightCityVideo,
  },
  {
    id: 2,
    title: "Dreams",
    artist: "Fleetwood Mac",
    genre: "Rock",
    cover: dreamsCover,
    audio: "/audio/dreams.mp3",
    // video: "/videos/dreams.mp4", // optional
  },
  {
    id: 3,
    title: "Blinding Lights",
    artist: "The Weeknd",
    genre: "Pop",
    cover: blindingLightsCover,
    audio: "/audio/blinding-lights.mp3",
  },
  {
    id: 4,
    title: "Take On Me",
    artist: "a-ha",
    genre: "Synthpop",
    cover: takeOnMeCover,
    audio: "/audio/take-on-me.mp3",
  },
  {
    id: 5,
    title: "Electric Feel",
    artist: "MGMT",
    genre: "Indie Rock",
    cover: "/covers/electric-feel.jpg",
    audio: "/audio/electric-feel.mp3",
  }
  // add more later
];

const ForYou = () => {
  return (
    <div className="bg-black text-white min-h-screen">
        <div>
        <h1 className="text-3xl font-bold text-center py-6">Discover New Music For You</h1>
        </div>
      <div className="flex flex-col items-center snap-y snap-mandatory overflow-y-scroll h-screen px-4 py-6 space-y-6">
        {dummyFeed.map((item) => (
        <div key={item.id} className="snap-start h-screen flex items-center justify-center">
          <MusicCard key={item.id} item={item} />
        </div>
        ))}
      </div>
    </div>
  );
};

export default ForYou;