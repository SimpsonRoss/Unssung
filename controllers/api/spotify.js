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

    // commenting out whilst testing
    // if (req.user) {
    //   const expirationTime = new Date().getTime() + expires_in * 1000;
    //   console.log('Updating user ' + req.user._id + ' with Spotify tokens');

    // Using req.session.userId instead of req.user._id for testing, because I'm having trouble accessing req.user._id
    // from the JWT token once spotify redirects back, so instead I apply the id to the session at login
    if (true) {
      const expirationTime = new Date().getTime() + expires_in * 1000;
      console.log('Updating user ' + req.session.userId + ' with Spotify tokens');
      
      await User.findByIdAndUpdate(req.session.userId, {
        spotifyAccessToken: access_token,
        spotifyRefreshToken: refresh_token,
        spotifyTokenExpiration: expirationTime
      }, { new: true });
    }

    // Do other things, such as storing the tokens in the session, etc.
    res.redirect('http://localhost:3000?session_id=YourSecureSessionID');
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
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(400).send('User not found.');
  }

  const token = user.spotifyAccessToken;

  try {
    const url = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5';
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status !== 200) {
      return res.status(response.status).send('Spotify API Error');
    }

    const data = await response.json();
    res.status(200).send(data);
    
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    res.status(500).send('Internal Server Error');
  }
}

async function getCurrentUserProfile(req, res) {
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(400).send('User not found.');
  }

  const token = user.spotifyAccessToken;

  try {
    const url = 'https://api.spotify.com/v1/me';
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status !== 200) {
      return res.status(response.status).send('Spotify API Error');
    }

    const data = await response.json();
    const imageUrl = data.images[0]?.url || null;

    await User.findByIdAndUpdate(req.session.userId, {
      avatar: imageUrl
    }, { new: true });

    res.status(200).send(data);

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send('Internal Server Error');
  }
}


async function createPlaylistAPI(req, res) {

  const { tracksUri, roundNumber, gameTitle, songScoreDeadline } = req.body;

  console.log('Session data in createPlaylistAPI:', req.session);

  const user = await User.findById('64e8b0111ed7711eef7ec075'); //TEMP HARD CODED FOR EASE OF TESTING
  // const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(400).send('User not found.');
  }

  let token = user.spotifyAccessToken;  // Get the current token from the user

  const playlistName = `Round ${roundNumber} - ${gameTitle}`;
  const playlistDescription = `Deadline to rate songs: ${new Date(songScoreDeadline).toLocaleString()}. Love from trkR8.`;


  async function attemptPlaylistCreation() {
    try {
      const { data: { id: user_id } } = await axios.get('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const { data: playlist } = await axios.post(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        "name": playlistName,
        "description": playlistDescription,
        "public": true
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      await axios.post(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        uris: tracksUri
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      res.status(200).json({ playlistId: playlist.id });

    } catch (error) {
      // Check if token is expired (status code 401)
      if (error.response && error.response.status === 401) {
        const refreshResult = await refreshAccessToken(user._id);
        if (refreshResult.status !== 200) {
          res.status(refreshResult.status).send(refreshResult.message);
          return;
        }
        token = refreshResult.access_token;  // Update the token
        return attemptPlaylistCreation();  // Retry the function
      } else {
        console.error("Spotify API error:", error.response ? error.response.data : error);
        res.status(500).send('Internal Server Error');
      }
    }
  }

  await attemptPlaylistCreation();  // Initial attempt
}
