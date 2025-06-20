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
**Harmonize** is a social music discovery platform where users can:

- Discover new tracks through personalized feeds

- Express their music taste with customizable profile tiles

- Connect with other listeners via shared interests and interactive map views

Our goal is to make the experience of finding music more **personal, expressive, and socially engaging.**

### UI Highlights
- Discovery Page
<img width="1512" alt="Discovery Page" src="https://github.com/user-attachments/assets/4df9a868-24b9-4b34-badc-789d8bf6caea" />

- Home Page
<img width="1512" alt="Home Page" src="https://github.com/user-attachments/assets/d8846edc-8ef0-41e5-afc5-31d63adeb767" />

- Map Page
<img width="1512" alt="Map Page" src="https://github.com/user-attachments/assets/526dc814-0cfa-4978-8ab3-52f704ddd98b" />

- Blend Mode Comparison
<img width="1507" alt="Blend Mode" src="https://github.com/user-attachments/assets/04b895e3-dba9-4fe1-ba9f-cd0504ba3469" />

- Galaxy Mode (Taste Clustering)
<img width="1509" alt="Galaxy Mode" src="https://github.com/user-attachments/assets/fce174a3-7d93-41e2-8442-7ce66cb95584" />

## IMPORTANT!! SIGN UP/ONBOARDING INSTRUCTIONS

1. **Create an Account**  
   To sign up with our account, click **Sign Up** and fill in your Name, Username, Email, and Password. Once done, you need to click Connect to spotify (see instruction #2).
2. **Connect to Spotify**  
   Due to Spotify's production API restrictions, we still need to manually add users due to us not being a company.
   !! **Send the email** you use to log in to spotify to one of our developers so we can authorize your account.
3. **Personalize Your Account**  
   After signing in, navigate to your **Profile page** to:
   - Add a bio and a profile picture
   - Add tiles to your spaces which can be toggled under your Profile page.
> Note: When you click edit or delete a tile, you need to click on "Edit" or "delete" over the tile, and press **Enter** one more time or move the tile to enter the Edit or Delete mode. 
4. **Connect with Friends**  
  If you want to see friends, we have a list of user accounts you can test. Search up any of these names in the list in the Friend's page search bar: ["Trak", "Shisui", "Giselle", "Rachael", "Evelyn"].
6. **Find Friends & Events on Map**  
  Navigate to the Map page and allow location access.
> Note: You’ll only see friends who’ve shared their location.

**That’s it!** You’re ready to harmonize, discover fresh tracks, and connect with the music-loving community. Enjoy our app!

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
```bash
git clone https://github.com/dartmouth-cs52-25s/project-music-and-memories.git
cd project-music-and-memories
```

### Clone the backend repo
```bash
git clone https://github.com/dartmouth-cs52-25s/project-music-and-memories-api.git
cd project-music-and-memories-api
```

### Install dependencies
```bash
npm install
npm install @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @emotion/react @emotion/styled @mui/icons-material @mui/material @mui/styled-engine-sc @phosphor-icons/react @react-three/drei @react-three/fiber axios chart.js connect-mongo d3 d3-cloud express-session framer-motion leaflet lucide-react ngeohash react react-chartjs-2 react-dom react-grid-layout react-leaflet react-markdown react-resizable react-router-dom react-simple-maps shadcn styled-components three zustand
```

### Setup backend
```bash
npm install axios bcrypt chart.js cookie-session cors dotenv express mongoose ngeohash node-fetch react-chartjs-2 spotify-buddylist spotify-preview-finder spotify-web-api-node uuid
```


### Start servers in dev mode
#### Frontend
```bash
npm run dev
```
#### Backend
```bash
npm start
```

> ⚠**Note**: Spotify login **only works on the deployed website** due to OAuth redirect URI restrictions. Running the project locally will not allow login, and features like friends, blend mode, and personalized data will not function.

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



