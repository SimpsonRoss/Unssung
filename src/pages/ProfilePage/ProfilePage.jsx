import React, { useEffect, useState } from "react";

export default function ProfilePage({ user, setUser }) {
  const [topTracks, setTopTracks] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    console.log('RUNNING')
    try {
      const res = await fetch('http://localhost:3000/api/users/' + user._id, {
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
    window.location = 'http://localhost:5001/api/spotify/login';
  };

  useEffect(() => {


  }, []);


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
    let updatedUser = {...user}
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5001/api/spotify/me', {
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
      
      {user.spotifyAccessToken ? 
      <>
      <br />
      <img className="profilePhoto" src={user.avatar} alt={`${user.name}'s Avatar`} />
      <br />
      </>
      :
      null}
    
      <h1 className='mt-3 mb-3'>{user.name}</h1>
      <hr />
      <h4 className='mb-3'>{user.email}</h4>

      {!user.spotifyAccessToken ? 
      <>
      <h2 className='mt-4 mb-3 text-warning'>Connect your Spotify</h2>
      <button className="btn btn-outline-light mb-3" onClick={handleSpotifyAuth}>Connect now</button> 
      <p className="px-5"> A connection to Spotify is required before you can play.</p>

      </> 
      : 
      <>
      <h2 className='mb-4 text-success'>Spotify connected</h2>
      <h2 className="mb-4">Currently listening to</h2>
      {topTracks ? (
        <ol className='list-group'>
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
