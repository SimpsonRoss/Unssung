import React, { useEffect, useState } from "react";

export default function ProfilePage({ user, setUser }) {
  const [topTracks, setTopTracks] = useState(null);

  const handleSpotifyAuth = async () => {
    window.location = 'http://localhost:5001/api/spotify/login';
  };

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/spotify/top-tracks', {
          method: 'GET',
          credentials: 'include'  // Important
        });
        if (res.status !== 200) throw new Error("Bad response from server");
        const data = await res.json();
        setTopTracks(data.items);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchTopTracks();
  }, []);
  
  return (
    <>
      <h1>{user.name}'s Profile Page</h1>
      <p>Email: {user.email}</p>

      <h2>Connect your Spotify</h2>
      <button onClick={handleSpotifyAuth}>Connect</button>

      <h2>Your Top Tracks</h2>
      {topTracks ? (
        <ul>
          {topTracks.map((track, i) => (
            <li key={i}>{`${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
