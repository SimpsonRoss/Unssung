import React from "react";
// import { CLIENT_SECRET, CLIENT_ID, REDIRECT_URL_AFTER_LOGIN, SPOTIFY_AUTHORIZE_ENDPOINT, SCOPES_URL_PARAM } from "../../utilities/spotifyAuth";

export default function ProfilePage({ user, setUser}) {
  
    const handleSpotifyAuth = async () => {
      // window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
      window.location = 'http://localhost:5001/api/spotify/login';
    }
    
    return (
      <>
        <h1>{user.name}'s Profile Page</h1>
        <p>Email: {user.email}</p>
  
        <h2>Connect your Spotify</h2>
        <button onClick={handleSpotifyAuth}>Connect</button>
      </>
    );
}