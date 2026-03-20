# YouTube Saved Content Search - Implementation Plan

The goal is to implement the robust 3-tier microservices architecture we finalized in the design phrase.

## Proposed Changes

We will build this in `c:\git\YouTubeSearch`.

### 1. Solution Setup
We will initialize the global `.sln` file and the base folders.
#### [NEW] `YouTubeSearch.sln`

### 2. Microservice 1: Auth Service (Port 5001)
Owns the local PostgreSQL database. Handles Google OAuth login, issues sessions, and exposes an internal endpoint for other services to request tokens.
#### [NEW] `Services/AuthService/AuthService.csproj`
#### [NEW] `Services/AuthService/appsettings.Development.json` (Stores Google Client Secret locally and Postgres connection string)
#### [NEW] `Services/AuthService/Data/AppDbContext.cs` (EF Core context exclusive to Auth)
#### [NEW] `Services/AuthService/Controllers/AuthController.cs` (Handles `/login`, `/callback`, `/user`)
#### [NEW] `Services/AuthService/Controllers/InternalController.cs` (Handles internal REST requests for tokens)

### 3. Microservice 2: YouTube Search Service (Port 5002)
Handles interactions with the YouTube Data API. It retrieves the required Google Access Token by making an internal REST HTTP call to the Auth Service using an `HttpClient`.
#### [NEW] `Services/YouTubeService/YouTubeService.csproj`
#### [NEW] `Services/YouTubeService/Services/AuthApiClient.cs` (Typed HTTP Client to communicate with Auth Service)
#### [NEW] `Services/YouTubeService/Controllers/YouTubeController.cs` (Handles `/liked-videos`)

### 4. Microservice 3: API Gateway (Port 8080)
Uses YARP to route traffic appropriately from the browser so we dodge CORS issues entirely.
#### [NEW] `Gateway/GatewayService/GatewayService.csproj`
#### [NEW] `Gateway/GatewayService/Program.cs`
#### [NEW] `Gateway/GatewayService/appsettings.json` (YARP configuration rules: `/api/auth` -> 5001, `/api/youtube` -> 5002, `/*` -> 3000)

### 5. Frontend UI Service (Port 3000)
React Single Page Application bundled with Vite, styled with Tailwind CSS, and managed by Redux Toolkit.
#### [NEW] `UI/package.json`
#### [NEW] `UI/tailwind.config.js`
#### [NEW] `UI/src/store/store.js` (Redux Store configuration)
#### [NEW] `UI/src/store/apiSlice.js` (RTK Query definition for our `.NET APIs`)
#### [NEW] `UI/src/App.jsx`
#### [NEW] `UI/src/components/VideoGrid.jsx`

## Verification Plan

### Automated Verification
- We will run `dotnet build YouTubeSearch.sln` to ensure all 4 C# projects compile.
- We will run `npm install && npm run build` inside the UI project.

### Manual Verification
1. Ensure the local PostgreSQL service is running.
2. Provide the Google Client ID/Secret in `AuthService`.
3. Start the 4 processes (Auth, YouTube, Gateway, UI) simultaneously.
4. Open the browser to `http://localhost:8080/`.
5. Click "Login with Google".
6. Verify successful redirect and dashboard rendering of Liked Videos!
