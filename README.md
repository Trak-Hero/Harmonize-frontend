# HARMONIZE:

## Harmonize with your friends

![ITeam Photo](https://hackmd.io/_uploads/H1fyF3I1ll.jpg)
[*how?*](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

## Dev URLS

[Frontend](https://project-music-and-memories-umzm.onrender.com/discover)
[API Server](https://project-music-and-memories-api.onrender.com/)

TODO: short project description, some sample screenshots or mockups

<img width="1512" alt="Screenshot 2025-06-08 at 3 03 42 PM" src="https://github.com/user-attachments/assets/4df9a868-24b9-4b34-badc-789d8bf6caea" />
<img width="1512" alt="Screenshot 2025-06-08 at 3 04 15 PM" src="https://github.com/user-attachments/assets/d8846edc-8ef0-41e5-afc5-31d63adeb767" />
<img width="1512" alt="Screenshot 2025-06-08 at 3 04 33 PM" src="https://github.com/user-attachments/assets/526dc814-0cfa-4978-8ab3-52f704ddd98b" />
<img width="1507" alt="Screenshot 2025-06-08 at 3 05 21 PM" src="https://github.com/user-attachments/assets/04b895e3-dba9-4fe1-ba9f-cd0504ba3469" />
<img width="1509" alt="Screenshot 2025-06-08 at 3 05 43 PM" src="https://github.com/user-attachments/assets/fce174a3-7d93-41e2-8442-7ce66cb95584" />

## IMPORTANT!! SIGN UP/ONBOARDING INSTRUCTIONS

1. To sign up with our account, click Sign Up and fill in your Name, Username, Email, and Password. Once done, you need to click Connect to spotify (see second instructions).
2. To connect to Spotify, we need you to send the email you use to log in to spotify to one of our developers. We will add you to our list of verified spotify users for our applications. This must be done as we must be a registered company in order to use the full production version of Spotify's API application. At this stage, we still need to manually add users due to us not being a company.
3. Once complete, we recommend you to go edit your profile by adding a bio and a profile picture in your Profile page. We also suggest you to add tiles to your spaces which can be toggled under your Profile page. When you click edit or delete a tile, you need to click on "Edit" or "delete" over the tile, and press enter one more time or move the tile to enter the Edit or Delete mode. 
4. If you want to see friends, we have a list of user accounts you can test. Search up any of these names in the list in the Friend's page search bar: ["Trak", "Shisui", "Giselle", "Rachael", "Evelyn"].
5. If you want to see your friend's location, you need to go to the map page and allow location access.
6. Have fun playing around with our application!


Reverberate is a music discovery social media platform that connects listeners with emerging artists, and with each other. It is a platform that allows music lovers to explore fresh, undiscovered tracks while engaging with a diverse community of users and supporting new artists.


## Architecture

### Front-end: *reverberate-client*

Framework to use: React + Vite
Styling: Tailwind CSS + CSS Modules (custom gradients and glassmorphism)
State Managament: Zustand
Router: React Router
Map: Mapbox/Leaflet

#### Component Structure:
- User Profile (Customizable) - Trak
- Artist Profile (Mruno Bars) - Shisui
- Friends Page (Passport-style Cards) - Evelyn
- Discover Page (Home Page) (Explore page) - Rachael
- Event / Artists Map View - Giselle
- Blend Mode comparison view (Graphs/Charts) - TBD

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

- **Frontend**: Deployed via [Render](https://render.com), auto-deployed on push to `main` branch.
- **Backend**: Also hosted on Render with environment variables set securely.
- **Database**: MongoDB Atlas for managed NoSQL persistence.

## Authors

TODO: list of authors

- Trak (Purin) Prateepmanowong
- Shisui Torii
- Rachael Huang
- Giselle Wu
- Evelyn (Seoyoon) Choi

## Acknowledgments

- Special thanks to our TAs, Bruno Mars and Spotify <3



