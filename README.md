# HARMONIZE:

## Harmonize with your friends

![ITeam Photo](https://hackmd.io/_uploads/H1fyF3I1ll.jpg)

## Contents
- [Live URLs](#dev-urls)
- [Project Overview](#project-description)
- [Onboarding Instructions](#important-sign-uponboarding-instructions)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Setup](#setup)
- [Deployment](#deployment)
- [Authors](#authors)

## Dev URLS

[Frontend](https://project-music-and-memories-umzm.onrender.com/discover)
[API Server](https://project-music-and-memories-api.onrender.com/)

## Project Description
Harmonize is a social music discovery platform where users can discover new music, express their taste through customizable profiles, and connect with other listeners. Our goal was to make the experience of finding new music feel more personal, expressive, and socially engaging.

- Customizable profile tiles
<img width="1512" alt="Screenshot 2025-06-08 at 3 03 42 PM" src="https://github.com/user-attachments/assets/4df9a868-24b9-4b34-badc-789d8bf6caea" />
- Real-time friend/event map view
<img width="1512" alt="Screenshot 2025-06-08 at 3 04 15 PM" src="https://github.com/user-attachments/assets/d8846edc-8ef0-41e5-afc5-31d63adeb767" />
<img width="1512" alt="Screenshot 2025-06-08 at 3 04 33 PM" src="https://github.com/user-attachments/assets/526dc814-0cfa-4978-8ab3-52f704ddd98b" />
<img width="1507" alt="Screenshot 2025-06-08 at 3 05 21 PM" src="https://github.com/user-attachments/assets/04b895e3-dba9-4fe1-ba9f-cd0504ba3469" />
<img width="1509" alt="Screenshot 2025-06-08 at 3 05 43 PM" src="https://github.com/user-attachments/assets/fce174a3-7d93-41e2-8442-7ce66cb95584" />

## IMPORTANT!! SIGN UP/ONBOARDING INSTRUCTIONS

1. To sign up with our account, click Sign Up and fill in your Name, Username, Email, and Password. Once done, you need to click Connect to spotify (see instruction #2).
2. To connect to Spotify, we need you to send the email you use to log in to spotify to one of our developers. We will add you to our list of verified spotify users for our applications. This must be done as we must be a registered company in order to use the full production version of Spotify's API application. At this stage, we still need to manually add users due to us not being a company.
3. Once complete, we recommend you to go edit your profile by adding a bio and a profile picture in your Profile page. We also suggest you to add tiles to your spaces which can be toggled under your Profile page. When you click edit or delete a tile, you need to click on "Edit" or "delete" over the tile, and press enter one more time or move the tile to enter the Edit or Delete mode. 
4. If you want to see friends, we have a list of user accounts you can test. Search up any of these names in the list in the Friend's page search bar: ["Trak", "Shisui", "Giselle", "Rachael", "Evelyn"].
5. If you want to see your friend's location, you need to go to the map page and allow location access. You can't see the location of any friend who did not share their location.
6. Have fun playing around with our application!


Harmonize is a music discovery social media platform that connects listeners with emerging artists, and with each other. It is a platform that allows music lovers to explore fresh, undiscovered tracks while engaging with a diverse community of users and supporting new artists.


## Architecture

### Front-end: *reverberate-client*

Framework to use: React + Vite
Styling: Tailwind CSS + CSS Modules (custom gradients and glassmorphism)
State Management: Zustand
Router: React Router
Map: Mapbox/Leaflet

#### Component Structure:
- User Profile (Customizable) - Trak
- Artist Profile (Mruno Bars) - Shisui
- Friends Page (Passport-style Cards) - Evelyn
- Discover Page (Home Page) (Explore page) - Rachael
- Event & Friends Map View - Giselle
- Blend Mode comparison view (Graphs/Charts) - Giselle

### Front-end: *reverberate-api* 

Framework: Express.js
Database: MongoDB (via Mongoose)

# Backend Data Model Documentation

## Framework & Technology Stack
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** Session-based with Spotify OAuth integration
- **External APIs:** Spotify Web API, Ticketmaster API, OpenCage Geocoding API

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/spotify/login` - Spotify OAuth login
- `GET /auth/spotify/callback` - Spotify OAuth callback
- `GET /auth/api/me` - Get current user profile

### Users
- `GET /users` - Get all users
- `GET /users/search` - Search users (authenticated)
- `GET /users/:id` - Get user profile
- `POST /users/:id/follow` - Follow user (authenticated)
- `DELETE /users/:id/follow` - Unfollow user (authenticated)
- `GET /users/:id/following` - Get user's following list
- `GET /users/:id/followers` - Get user's followers list
- `POST /users/location` - Update user location (authenticated)

### Artists
- `GET /artists` - Get all artists
- `POST /artists` - Create artist
- `GET /artists/spotify/search` - Search Spotify artists
- `GET /artists/spotify/:id` - Get Spotify artist data
- `PATCH /artists/:id/follow` - Follow/unfollow artist
- `PATCH /artists/:id/bio` - Update artist bio

### Music Posts
- `GET /posts` - Get all music posts
- `POST /posts` - Create music post (authenticated)
- `GET /posts/spotify/search` - Search Spotify tracks
- `POST /posts/:id/like` - Like music post (authenticated)
- `POST /posts/:id/unlike` - Unlike music post (authenticated)
- `GET /posts/my-posts` - Get user's posts (authenticated)

### Spotify Integration
- `GET /spotify/search` - Search Spotify (artists/tracks)
- `GET /spotify/top-artists` - Get user's top artists (authenticated)
- `GET /spotify/user/:id` - Get friend's Spotify data
- `GET /spotify/friends/top` - Get friends' top music (authenticated)

### Music Discovery & Recommendations
- `GET /api/me/spotify` - Get user's Spotify profile + top music
- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/discover/:method` - Alternative discovery methods
- `GET /api/recent` - Get recently played tracks
- `GET /api/genre-stats` - Get user's genre statistics
- `GET /api/genre-timeline` - Get genre listening timeline

### Events
- `GET /events` - Get all events
- `POST /events` - Create event
- `GET /ticketmaster/events?lat=...&lng=...&radius=...` - Get Ticketmaster events by location (coordinates)

### Tiles (Dashboard)
- `GET /tiles` - Get user's tiles
- `POST /tiles` - Create tile (authenticated)
- `PATCH /tiles/:id` - Update tile (authenticated)
- `DELETE /tiles/:id` - Delete tile (authenticated)
- `PATCH /tiles/bulk-layout` - Bulk update tile positions

### Utilities
- `GET /geocode/reverse` - Reverse geocoding (lat/lng to city)
- `GET /blend/:user1/:user2` - Generate music taste comparison

## Data Models

### User
```
{
  displayName: String,      // Display name
  username: String,         // Unique username (lowercase)
  bio: String,             // User biography
  avatar: String,          // Profile picture URL
  email: String,           // Email address (unique, sparse)
  password: String,        // Hashed password
  accountType: String,     // 'user' | 'artist'
  
  // Spotify Integration
  spotifyId: String,       // Spotify user ID (unique, sparse)
  spotifyAccessToken: String,
  spotifyRefreshToken: String,
  spotifyTokenExpiresAt: Date,
  
  // Social Features
  followers: [ObjectId],   // Users following this user (ref: User)
  following: [ObjectId],   // Users followed by this user (ref: User)
  
  // Location (GeoJSON Point)
  location: {
    type: 'Point',
    coordinates: [Number]  // [longitude, latitude], default [0, 0]
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Artist
```
{
  artistName: String,      // Artist name
  bio: String,            // Artist biography
  spotifyId: String,      // Spotify artist ID
  profilePic: String,     // Profile picture URL
  followers: [String],    // User IDs following this artist
  
  // Spotify Data
  albums: [{             // Album information
    id: String,
    name: String,
    cover: String,
    year: String,
    images: [{ url: String }]
  }],
  topTracks: [{          // Top tracks
    id: String,
    name: String,
    popularity: Number,
    album: { images: [{ url: String }] }
  }]
}
```
### Music Post
```
{
  spotifyTrackId: String,  // Spotify track ID (required)
  title: String,          // Track title (required)
  artist: String,         // Artist name(s) (required)
  genre: String,          // Music genre
  coverUrl: String,       // Album cover URL
  previewUrl: String,     // 30s preview URL from Spotify
  duration: Number,       // Track duration in seconds
  caption: String,        // User's caption/description
  tags: [String],         // Post tags
  uploadedBy: ObjectId,   // User who posted (ref: User)
  playCount: Number,      // Play count (default: 0)
  likes: Number,          // Like count (default: 0)
  likedBy: [ObjectId],    // Users who liked (ref: User)
  createdAt: Date
}
```

### Event
```
{
  spotifyTrackId: String,  // Spotify track ID (required)
  title: String,          // Track title (required)
  artist: String,         // Artist name(s) (required)
  genre: String,          // Music genre
  coverUrl: String,       // Album cover URL
  previewUrl: String,     // 30s preview URL from Spotify
  duration: Number,       // Track duration in seconds
  caption: String,        // User's caption/description
  tags: [String],         // Post tags
  uploadedBy: ObjectId,   // User who posted (ref: User)
  playCount: Number,      // Play count (default: 0)
  likes: Number,          // Like count (default: 0)
  likedBy: [ObjectId],    // Users who liked (ref: User)
  createdAt: Date
}
```

### Track
```
{
  spotifyTrackId: String,  // Spotify track ID (required)
  title: String,          // Track title (required)
  artist: String,         // Artist name(s) (required)
  genre: String,          // Music genre
  coverUrl: String,       // Album cover URL
  previewUrl: String,     // 30s preview URL from Spotify
  duration: Number,       // Track duration in seconds
  caption: String,        // User's caption/description
  tags: [String],         // Post tags
  uploadedBy: ObjectId,   // User who posted (ref: User)
  playCount: Number,      // Play count (default: 0)
  likes: Number,          // Like count (default: 0)
  likedBy: [ObjectId],    // Users who liked (ref: User)
  createdAt: Date
}
```

### Tile
```
{
  userId: ObjectId,       // User who owns the tile (required, ref: User)
  type: String,          // Tile type (required)
  title: String,         // Tile title
  content: String,       // Tile content
  bgImage: String,       // Background image URL
  bgColor: String,       // Background color
  font: String,          // Font family
  x: Number,             // Grid X position
  y: Number,             // Grid Y position
  w: Number,             // Grid width
  h: Number,             // Grid height
  createdAt: Date,
  updatedAt: Date
}
```

### MusicTasteGraph
```
{
  user1: ObjectId,           // First user reference (required, ref: User)
  user2: ObjectId,           // Second user reference (required, ref: User)
  overlapScore: Number,      // Compatibility score
  sharedArtists: [String],   // Common artist IDs
  differentGenres: [String], // Differing genres
  generatedAt: Date          // Generation timestamp (default: Date.now)
}
```

### Friends
```
{
  userId: ObjectId,       // User who initiated friendship (required, ref: User)
  friendId: ObjectId,     // User who was friended (required, ref: User)
  createdAt: Date,
  updatedAt: Date
}
```

### Playlist
```
{
  userId: ObjectId,       // Playlist owner (required, ref: User)
  name: String,          // Playlist name (required)
  trackIds: [ObjectId],  // Track references (ref: Track)
  isPublic: Boolean,     // Public visibility (default: false)
  createdAt: Date,
  updatedAt: Date
}
```


## Setup

These steps get your dev environment running smoothly:

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

- **Frontend**: Deployed via [Render](https://render.com), auto-deployed on push to `main` branch.
- **Backend**: Also hosted on Render with environment variables set securely.
- **Database**: MongoDB Atlas for managed NoSQL persistence.

## Authors

- Trak (Purin) Prateepmanowong
- Shisui Torii
- Rachael Huang
- Giselle Wu
- Evelyn (Seoyoon) Choi

## Acknowledgments

- Special thanks to our TAs, Bruno Mars and Spotify <3



