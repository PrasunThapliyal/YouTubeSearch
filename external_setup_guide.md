# Google Cloud Console Setup Guide

To allow our application to authenticate users and access their YouTube data, we must register our application with Google Cloud to obtain OAuth 2.0 credentials. 

Follow these steps exactly to set up your project.

## Step 1: Create a Google Cloud Project
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with your Google account.
3. In the top navigation bar, click the project dropdown and select **New Project**.
4. Name your project (e.g., `YouTube-Saved-Search`) and click **Create**.
5. Once created, ensure your new project is selected in the top navigation bar.

## Step 2: Enable the YouTube Data API v3
1. In the left-hand menu, go to **APIs & Services > Library**.
2. Search for **"YouTube Data API v3"**.
3. Click on it and click the **Enable** button.

## Step 3: Configure the OAuth Consent Screen
*This is the screen users see when they click "Sign in with Google."*

1. In the left-hand menu, go to **APIs & Services > OAuth consent screen**.
2. Choose **External** for the User Type (allowing any Google user to log in) and click **Create**.
3. Fill in the required **App Information**:
   - App name: (e.g., "My YouTube Search")
   - User support email: (Your email)
   - Developer contact email: (Your email)
4. Click **Save and Continue**.
5. **Scopes**: Click **Add or Remove Scopes**.
   - Search for `https://www.googleapis.com/auth/youtube.readonly`.
   - Check the box and click **Update**.
   - *Note: We specifically want `readonly` to assure users we cannot delete their videos or upload on their behalf.*
6. Click **Save and Continue**.
7. **Test Users**: While your app is in "Testing" mode, only specific emails can log in. Add your own Google email address here.
8. Click **Save and Continue**, then review your summary.

## Step 4: Create OAuth 2.0 Client Credentials
1. In the left-hand menu, go to **APIs & Services > Credentials**.
2. Click **+ Create Credentials** at the top and select **OAuth client ID**.
3. For **Application type**, select **Web application**.
4. Name the client (e.g., "YouTubeSearch Web App").
5. Under **Authorized redirect URIs**, click **+ Add URI**.
   - For local development with .NET, add: `https://localhost:5001/api/auth/callback` (or whatever local port your .NET backend ends up using. We will finalize this port during coding).
   - Also add `https://localhost:5001/signin-google` which is the standard default redirect URI used by .NET Core authentication middleware.
6. Click **Create**.

## Step 5: Secure Your Credentials
A modal will appear displaying your **Client ID** and **Client Secret**.
1. Copy both of these values.
2. **CRITICAL:** Treat the `Client Secret` like a password. Never commit it to GitHub. 
3. We will store these in the .NET backend's secure `appsettings.Development.json` file or User Secrets once we begin coding.
