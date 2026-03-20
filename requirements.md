# YouTube Saved Content Search - MVP Requirements

## Overview
A web application designed to empower everyday YouTube users to easily access, search, and manage their saved content (such as liked videos and playlists) outside the native YouTube interface.

## User Persona
A regular YouTube user who consumes a lot of educational or entertainment content, saves videos by "liking" them or adding them to specific playlists, and currently struggles to easily search through this curated list of saved content.

## Scope of Minimum Viable Product (MVP)
The initial MVP will focus strictly on delivering a single, end-to-end user flow: retrieving and displaying "Liked Videos."

### Core Features
1. **User Authentication (Google Sign-In)**
   - Users must be able to securely authenticate using their Google accounts.
   - The app must request specific scopes to read the user's YouTube account data (specifically `https://www.googleapis.com/auth/youtube.readonly`).

2. **Data Retrieval (Liked Videos)**
   - Upon successful authentication, the system will fetch the list of videos the user has implicitly saved by "liking" them.
   - The data will be retrieved using the official YouTube Data API v3.

3. **Data Display**
   - A clean, responsive User Interface (UI) displaying the retrieved videos.
   - Each video entry must surface the following metadata:
     - **Title:** The name of the video.
     - **Description:** A snippet or full text of the video description.
     - **Thumbnail:** A visual preview of the video.
     - **URL:** A direct, clickable link to watch the video on YouTube.

4. **Security & Data Privacy**
   - OAuth tokens must be securely handled.
   - The app will only read data; it will not modify the user's YouTube account (read-only access).

## Out of Scope for MVP
- Searching through text/transcripts.
- Managing playlists.
- User-defined tags or categories.
- Syncing data to a local database for offline fast querying.
