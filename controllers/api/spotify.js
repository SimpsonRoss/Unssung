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
  createPlaylistAPI
};

// Hardcoded user ID for testing
// const USER_ID = '64e8b0111ed7711eef7ec075';

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


async function refreshAccessToken(req, res) {
  console.log('Refreshing Spotify access token. req.user:', req.user);
  
  if (!req.user || !req.user.spotifyRefreshToken) {
    console.error("No refresh token found");
    res.status(400).send('No refresh token found. Login required.');
    return;
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: req.user.spotifyRefreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;

    await User.findByIdAndUpdate(req.user.id, {
      spotifyAccessToken: access_token,
    });

    res.send({ 'access_token': access_token });
  } catch (err) {
    console.error(err);
    res.status(400).send('Failed to refresh Spotify access token.');
  }
}


async function getTopTracks(req, res) {
  // console.log('Getting top tracks. req.session.userId:', req.session.userId);
  // TEMPORARILY - hardcoding user ID for testing
  const user = await User.findById('64e8b0111ed7711eef7ec075');
  if (!user) {
    return res.status(400).send('User not found.');
  }

  const token = user.spotifyAccessToken;
  // console.log('TOKEN:', token)
  // console.log('USER:', user)

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

async function createPlaylistAPI(req, res) {
  const user = await User.findById('64e8b0111ed7711eef7ec075');
  if (!user) {
    return res.status(400).send('User not found.');
  }

  const token = user.spotifyAccessToken;
  console.log('TOKEN from createPlaylistAPI:', token)
  const { tracksUri } = req.body;
  // console.log('tracksUri:', tracksUri)
  try {
    const { data: { id: user_id } } = await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('user_id:', user_id)
    
    const { data: playlist } = await axios.post(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
      "name": "NEWWW PLAYLIST FROM APP",
      "description": "HOLY SH*T THIS WORKED",
      "public": true
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    await axios.post(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      uris: tracksUri
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    res.status(200).json({ playlist });
  } catch (error) {
    console.error("Spotify API error:", error.response ? error.response.data : error);
    res.status(500).send('Internal Server Error');
    }
}

