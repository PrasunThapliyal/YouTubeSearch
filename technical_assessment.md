# Technical Assessment & Tech Stack Evaluation

## 1. High-Level Requirements Assessment
The MVP requirements (Google Authentication + fetching YouTube Liked Videos) are straightforward and well-supported by Google's ecosystem. 
- **Google OAuth 2.0** provides a standardized way to handle user sign-in and delegate access.
- **YouTube Data API v3** has built-in endpoints specifically designed for this. The `Videos: list` endpoint supports the `myRating=like` parameter precisely to fetch a user's liked videos.

**Conclusion:** The project is highly feasible. The primary complexity will be managing the OAuth 2.0 flow (handling redirects, securely storing tokens) and managing API quotas.

## 2. Tech Stack Evaluation
You suggested: **React JS (Vite) + .NET 8 Core + PostgreSQL**

This is an **excellent, enterprise-grade technology stack** that offers a great balance of developer productivity, performance, and scalability.

### Frontend: React JS with Vite
- **Pros:** Vite offers near-instant server starts and lightning-fast Hot Module Replacement (HMR). React's component-based architecture is perfect for building dynamic UIs (like a video list grid). Strong ecosystem for OAuth libraries and UI components.
- **Fit:** Perfect for a responsive Single Page Application (SPA).

### Backend: .NET 8 Core (Web API)
- **Pros:** Extremely fast, strictly typed (C#), and memory efficient. Excellent built-in dependency injection, configuration management, and robust security middleware for handling JWTs and OAuth flows (e.g., `Microsoft.AspNetCore.Authentication.Google`). Provides great libraries to consume Google APIs (`Google.Apis.YouTube.v3`).
- **Fit:** Ideal for acting as a secure intermediary layer. It will handle the OAuth client secret safely (which should never be exposed to the React frontend) and communicate with the YouTube API securely on the user's behalf.

### Database: PostgreSQL
- **Pros:** The most advanced open-source relational database. Highly reliable, scalable, and supports `JSONB` data types.
- **Fit:** While the MVP technically relies on live queries to the YouTube API, introducing Postgres from the start is a very smart move. It allows us to seamlessly transition into storing user profiles, caching YouTube API responses (to avoid hitting rate limits), and storing app-specific metadata (like custom tags or search history). EF Core 8 (Entity Framework) provides phenomenal support for PostgreSQL.

## 3. Recommended Architecture Flow for MVP
1. **Frontend (React)** initiates the Google OAuth 2.0 flow (either via redirect or popup).
2. User authenticates on Google's servers.
3. Google returns an Authorization Code to the **Backend (.NET 8)**.
4. The Backend exchanges this code for an Access Token and Refresh Token, securely storing necessary details/refresh tokens in **PostgreSQL**.
5. The Backend returns a secure session cookie or JWT to the Frontend to maintain the user's logged-in state.
6. The Frontend issues a request for "Liked Videos" to the Backend.
7. The Backend uses the stored Google Access Token to call the YouTube Data API, formats the response, and sends it back to the Frontend.

## 4. Future Directions & Features
Once the MVP is established, the application can evolve into a powerful personal knowledge management tool for video content:

1. **Playlist Integration:** Allow users to view and search structured playlists.
2. **Local Data Sync:** Periodically sync liked videos/playlists to PostgreSQL. This unlocks the ability to perform full-text searches across all video titles and descriptions *instantly*, without continually hitting YouTube API rate limits.
3. **Custom Tagging & Categorization:** Allow users to add custom tags (e.g., `#tutorial`, `#to-watch`) to synced videos that don't exist in YouTube natively.
4. **AI-Powered Summaries/Transcription Search:** Pre-process synced videos through an LLM to generate summaries, or fetch and store transcripts, allowing users to search for a specific *spoken word* across hundreds of videos.
5. **Channel Tracking:** Track specific subscriptions and automatically group newly uploaded videos based on user-defined keywords.
