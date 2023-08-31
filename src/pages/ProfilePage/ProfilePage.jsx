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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/spotify/me', {
          method: 'GET',
          credentials: 'include'
        });
        if (res.status !== 200) throw new Error("Bad response from server");
        const data = await res.json();
        setUser({
          ...user,
          avatar: data.images[0]?.url || null
        });
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchUserProfile();
  }, []);

  console.log('user avatar' + user.avatar)
  console.log('user' + user)
  console.log('user.spotifyAccessToken' + user.spotifyAccessToken)
  
  return (
    <>
      <br />
      <img className="profilePhoto" src={user.avatar} alt={`${user.name}'s Avatar`} />
      <br />
      <br />
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>

      { !user.spotifyAccessToken ? 
      <><h2>Connect your Spotify</h2><button onClick={handleSpotifyAuth}>Connect</button> </> : 
      <p>Spotify connected</p>
      }

      <h2>Your Top Tracks on Spotify</h2>
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
