import React, { useEffect, useState } from "react";
import { apiURLBackend, apiURLFrontend } from '../../utilities/config.js';


export default function ProfilePage({ user, setUser }) {
  const [topTracks, setTopTracks] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    console.log('RUNNING')
    try {
      const res = await fetch(`${apiURLFrontend}/api/users/${user._id}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (res.status !== 200) throw new Error("Bad response from server");
      const data = await res.json();


      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleSpotifyAuth = () => {
    sessionStorage.setItem('justAuthenticatedWithSpotify', 'true');
    window.location = `${apiURLBackend}/api/spotify/login`;
  };

  useEffect(() => {


  }, []);


  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const res = await fetch(`${apiURLBackend}/api/spotify/top-tracks`, {
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
    let updatedUser = {...user}
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiURLBackend}/api/spotify/me`, {
          method: 'GET',
          credentials: 'include'
        });
        if (res.status !== 200) throw new Error("Bad response from server");
        const data = await res.json();

        updatedUser = {
          ...updatedUser,
          avatar: data.images[0]?.url || null
        };
        console.log('updatedUser', updatedUser)
        return updatedUser;
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    const fetchData = async () => {
      const fetchedUser = await fetchUserData();
      if (fetchedUser) {
        updatedUser = {...updatedUser, ...fetchedUser};
        return updatedUser;
      }
      console.log('fetched and updated User' , fetchedUser, updatedUser)

     }

     const updateUser = async () => {
      const fetchedUser = await fetchData();
      const userProfile = await fetchUserProfile();
      console.log('fetchedUser' , fetchedUser)
      console.log('userProfile' , userProfile)
      setUser({...fetchedUser, ...userProfile})
     }
     updateUser();

    console.log('updatedUser at the end' , updatedUser )
  }, []);

  // console.log('user avatar' + user.avatar)
  // console.log('user' + JSON.stringify(user))
  console.log('user.spotifyAccessToken' + user.spotifyAccessToken)
  
  return (
    <>
      

    
      <h1 className='mt-3 mb-3'>{user.name}</h1>
      <div className='customHr'></div>

      {user.spotifyAccessToken ? 
      <>
    
      <img className="profilePhoto mb-3" src={user.avatar} alt={`${user.name}'s Avatar`} />
      
      </>
      :
      null}

      <h4 className='mb-3'>{user.email}</h4>

      {!user.spotifyAccessToken ? 
      <>
      <h2 className='mt-4 mb-3 text-warning'>Connect your Spotify</h2>
      <button className="btn btn-outline-light mb-3" onClick={handleSpotifyAuth}>Connect now</button> 
      <p className="px-5"> A connection to Spotify is required before you can play.</p>

      </> 
      : 
      <>
      <h2 className='mb-4 text-success1'>
      
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
</svg>
&nbsp;Spotify 
</h2>
      <h2 className="mb-4">Currently listening to</h2>
      {topTracks ? (
        <ol className='list-group list-unstyled'>
          {topTracks.map((track, i) => (
            <li className='list-group-item-dark mb-3' key={i}>{`${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`}</li>
          ))}
        </ol>
      ) : (
        <p>Loading...</p>
      )}
      </>
      }
    </>
  );
}
