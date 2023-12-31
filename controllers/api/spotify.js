// controllera/api/spotify.js

const axios = require('axios');
const fetch = require('node-fetch');
const qs = require('qs');
const User = require('../../models/user');

module.exports = {
  initiateSpotifyLogin,
  handleSpotifyRedirect,
  refreshAccessToken,
  getTopTracks,
  createPlaylistAPI,
  getCurrentUserProfile
};

function initiateSpotifyLogin(req, res) {
  const scopes = 'user-read-private user-library-read playlist-read-private user-top-read playlist-modify-public playlist-modify-private streaming user-read-email';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?client_id=' + process.env.SPOTIFY_CLIENT_ID +
    '&client_secret=' + process.env.SPOTIFY_CLIENT_SECRET +
    '&scope=' + encodeURIComponent(scopes) +
    '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URL_AFTER_LOGIN) +
    '&response_type=code'
  );
};

async function handleSpotifyRedirect(req, res) {
  console.log('Handling Spotify redirect. req.user:', req.session.userId);
  if (!req.session.userId) {
    console.error("Session userId not found");
    res.status(400).send("Session userId not found. Please log in.");
    return;
  }

  const { code } = req.query;
  if (!code) {
    console.error("No code received");
    res.status(400).send('No code received from Spotify. Login failed.');
    return;
  }
  


  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URL_AFTER_LOGIN,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    if (true) {
      const expirationTime = new Date().getTime() + expires_in * 1000;
      console.log('Updating user ' + req.session.userId + ' with Spotify tokens');
      
      await User.findByIdAndUpdate(req.session.userId, {
        spotifyAccessToken: access_token,
        spotifyRefreshToken: refresh_token,
        spotifyTokenExpiration: expirationTime
      }, { new: true });
    }

    res.redirect(`${process.env.FRONTEND_URL}/account?session_id=YourSecureSessionID`);
  } catch (err) {
    console.error(err);
    res.status(400).send('Spotify login failed.');
  }
};


async function refreshAccessToken(userId) {
  const user = await User.findById(userId);
  if (!user || !user.spotifyRefreshToken) {
    console.error("No refresh token found");
    return { status: 400, message: 'No refresh token found. Login required.' };
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: user.spotifyRefreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    await User.findByIdAndUpdate(userId, {
      spotifyAccessToken: access_token,
    });

    return { status: 200, access_token };
  } catch (err) {
    console.error(err);
    return { status: 400, message: 'Failed to refresh Spotify access token.' };
  }
}


async function getTopTracks(req, res) {
  console.log('Session data in getTopTracks:', req.session);

  if (!req.session.userId) {
    console.error("Session userId not found");
    res.status(400).send("Session userId not found. Please log in.");
    return;
  }

  let user = await User.findById(req.session.userId);
  if (!user) {
    console.error("User not found");
    res.status(400).send("User not found. Please log in.");
    return;
  }

  let token = user.spotifyAccessToken;
  if (!token) {
    console.error("No Spotify access token found");
    res.status(400).send("No Spotify access token found. Please log in again.");
    return;
  }
  

  async function attemptTopTracksFetch() {
    try {
      const url = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5';
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status !== 200) {
        throw new Error('Spotify API Error');
      }

      const data = await response.json();
      res.status(200).send(data);

    } catch (error) {
      if (error.message === 'Spotify API Error') {
        const refreshResult = await refreshAccessToken(user._id);
        if (refreshResult.status === 200) {
          token = refreshResult.access_token;
          return attemptTopTracksFetch();
        } else {
          res.status(refreshResult.status).send(refreshResult.message);
        }
      } else {
        console.error("Error fetching top tracks:", error);
        res.status(500).send('Internal Server Error');
      }
    }
  }
  
  await attemptTopTracksFetch();  // Initial attempt
}


async function getCurrentUserProfile(req, res) {
  
  console.log('GETTING PROFILE req.session.userId in getCurrentUserProfile:', req.session.userId);

  if (!req.session.userId) {
    console.error("Session userId not found");
    res.status(400).send("Session userId not found. Please log in.");
    return;
  }

  let user = await User.findById(req.session.userId);
  if (!user) {
    console.error("User not found");
    res.status(400).send("User not found. Please log in.");
    return;
  }

  let token = user.spotifyAccessToken;
  if (!token) {
    console.error("No Spotify access token found");
    res.status(400).send("No Spotify access token found. Please log in again.");
    return;
  }

  async function attemptUserProfileFetch() {
    try {
      const url = 'https://api.spotify.com/v1/me';
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status !== 200) {
        throw new Error('Spotify API Error');
      }

      const data = await response.json();
      const imageUrl = data.images[0]?.url || null;

      await User.findByIdAndUpdate(req.session.userId, { avatar: imageUrl }, { new: true });
      res.status(200).send(data);

    } catch (error) {
      if (error.message === 'Spotify API Error') {
        const refreshResult = await refreshAccessToken(user._id);
        if (refreshResult.status === 200) {
          token = refreshResult.access_token;
          return attemptUserProfileFetch();
        } else {
          res.status(refreshResult.status).send(refreshResult.message);
        }
      } else {
        console.error("Error fetching user profile:", error);
        res.status(500).send('Internal Server Error');
      }
    }
  }

  await attemptUserProfileFetch();  // Initial attempt
}


async function resolveShortSpotifyLink(url) {
  if (!url.startsWith('https://spotify.link/')) {
      return url;
  }

  try {
      const response = await axios.get(url, { 
          maxRedirects: 5, 
          validateStatus: function (status) {
              // Accept any status code less than 500, as we want to get the final URL even if it's an error page
              return status < 500;
          } 
      });
      return response.request.res.responseUrl || url;
  } catch (error) {
      console.error('Error resolving short Spotify link:', error);
      return url;  // Return the original URL if there's an error.
  }
}


async function createPlaylistAPI(req, res) {

    const { tracksUrls, roundNumber, gameTitle, songScoreDeadline } = req.body;

    // Guard rails in case the request body is missing parameters
    if (!tracksUrls || !roundNumber || !gameTitle || !songScoreDeadline) {
        console.error("Missing parameters in request body");
        res.status(400).send("Missing parameters in request body.");
        return;
    }

    // Process each URL and resolve short Spotify links
    const resolvedUrlsPromises = tracksUrls.map(async url => await resolveShortSpotifyLink(url));
    const resolvedUrls = await Promise.all(resolvedUrlsPromises);

    // Extract track IDs from the resolved URLs
    const tracksUri = resolvedUrls.map(url => {
      const urlParts = url.split('/');
      if (urlParts.length < 5) {
          console.error("Unexpected URL format:", url);
          return null;  // or handle this error differently
      }
      const trackId = urlParts[4].split('?')[0];
      return `spotify:track:${trackId}`;
  }).filter(Boolean);  // Remove any null values
  

  // Guard rails incase the user is not logged in or the user is not found
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(400).send('User not found.');
  }
  // Get the current token from the user
  let token = user.spotifyAccessToken;  

  // Creating the playlist name and description
  const playlistName = `Round ${roundNumber} - ${gameTitle}`;
  const playlistDescription = `Deadline to rate songs: ${new Date(songScoreDeadline).toLocaleString()}. Love from Unssung.`;

  async function attemptPlaylistCreation() {
    try {
      const { data: { id: user_id } } = await axios.get('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Make the request to create the playlist, adding the user id to the url
      const { data: playlist } = await axios.post(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        "name": playlistName,
        "description": playlistDescription,
        "public": true
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Add the tracks from the round into the playlist
      await axios.post(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        uris: tracksUri
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      res.status(200).json({ playlistId: playlist.id });

    } catch (error) {
      // Check if the Spotify access token is expired and if so refresh it
      if (error.response && error.response.status === 401) {
        const refreshResult = await refreshAccessToken(user._id);
        if (refreshResult.status !== 200) {
          res.status(refreshResult.status).send(refreshResult.message);
          return;
        }
        token = refreshResult.access_token;  // Update the token
        return attemptPlaylistCreation();  // Retry the function with the new token
      } else {
        console.error("Spotify API error:", error.response ? error.response.data : error);
        res.status(500).send('Internal Server Error');
      }
    }
  }
  await attemptPlaylistCreation();  // Initial attempt
}
