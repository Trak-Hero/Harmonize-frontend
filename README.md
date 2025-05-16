# PROJECT NAME: 

- Possible ideas: *Reverberate*

![Team Photo](Insert a Team Photo URL here)
[*how?*](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

TODO: short project description, some sample screenshots or mockups

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

## Deployment

TODO: how to deploy the project

## Authors

TODO: list of authors

- Trak (Purin) Prateepmanowong
- Shisui Torii
- Rachael Huang
- Giselle Wu
- Evelyn Choi

## Acknowledgments
