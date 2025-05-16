# PROJECT NAME:

- Possible ideas: *Reverberate*

![ITeam Photo](https://hackmd.io/_uploads/H1fyF3I1ll.jpg)
[*how?*](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

TODO: short project description, some sample screenshots or mockups

Reverberate is a music discovery platform designed for emerging music artists to be heard while also giving listeners a fun, intuitive way to stumble upon their next favorite track. 


## Architecture

### Front-end: *reverberate-client*

Framework to use: React + Vite
Styling: Tailwind CSS + CSS Modules (custom gradients and glassmorphism)
State Managament: Zustand
Router: React Router
Map: Mapbox/Leaflet

#### Component Structure:
- Homepage
- User Profile
- Artist Profile (Mruno Bars)
- Friends Page
- Discover Page (Events / Artists Map View)
- Blend Mode comparison view

### Front-end: *reverberate-api*

Framework: Express.js
Database: MongoDB (via Mongoose)
Endpoints:
- GET /users
- POST /artists
- GET /tracks, POST /tracks
- GET /events
- GET /blend/:user1/:user2

Data Models:
- User
`
{
  username: String,
  email: String,
  passwordHash: String,
  bio: String,
  profileImage: String,
  topArtists: [String],
  favoriteTracks: [ObjectId], 
  playlists: [ObjectId],
  friends: [ObjectId],
  location: { city: String, coordinates: [Number] }
}
`

- Artist (extends user)

`
{
  userId: ObjectId, // refs User
  artistName: String,
  bio: String,
  tags: [String], // genre, vibe, theme
  tracks: [ObjectId], // refs Track
  merchLinks: [String],
  profilePic: String
}
`

- Track
`
{
  title: String,
  artistId: ObjectId, // refs Artist
  audioUrl: String,
  coverArtUrl: String,
  tags: [String],
  visibility: String, // public | demo | preview
  likes: [ObjectId], // refs User
  comments: [{ userId: ObjectId, content: String, timestamp: Date }]
}
`

- Playlist

`
{
  userId: ObjectId,
  name: String,
  trackIds: [ObjectId],
  isPublic: Boolean
}
`

- Event

`
{
  title: String,
  artistId: ObjectId,
  location: {
    name: String,
    coordinates: [Number]
  },
  date: Date,
  description: String
}
`

- MusicTasteGraph

`
{
  user1: ObjectId,
  user2: ObjectId,
  overlapScore: Number,
  sharedArtists: [String],
  differentGenres: [String],
  generatedAt: Date
}
`

## Setup

TODO: how to get the project dev environment up and running, npm install etc

### Clone the repo
git clone https://github.com/dartmouth-cs52-25s/project-music-and-memories.git
cd project-music-and-memories

### Install dependencies
npm install
npm install react-router-dom tailwindcss postcss autoprefixer zustand

### Setup backend
npm install express mongoose dotenv cors

### Start servers in dev mode
npm run dev

## Deployment

TODO: how to deploy the project

Frontend: Render

Backend: Render

MongoDB Atlas for persistent database

## Authors

TODO: list of authors

- Trak (Purin) Prateepmanowong
- Shisui Torii
- Rachael Huang
- Giselle Wu
- Evelyn Choi

## Acknowledgments
