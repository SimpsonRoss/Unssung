// controllera/api/spotify.js

const axios = require('axios');
const qs = require('qs');
const User = require('../../models/user');


module.exports = {
  initiateSpotifyLogin,
  handleSpotifyRedirect,
  refreshAccessToken,
};

function initiateSpotifyLogin(req, res) {
  console.log('Initiating Spotify login. req.user:', req.user);
  const scopes = 'user-read-private user-library-read playlist-read-private user-top-read';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?client_id=' + process.env.SPOTIFY_CLIENT_ID +
    '&client_secret=' + process.env.SPOTIFY_CLIENT_SECRET +
    '&scope=' + encodeURIComponent(scopes) +
    '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URL_AFTER_LOGIN) +
    '&response_type=code'
  );
};

async function handleSpotifyRedirect(req, res) {
  console.log('Handling Spotify redirect. req.user:', req.user);
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

    if (req.user) {
      const expirationTime = new Date().getTime() + expires_in * 1000;
      
      await User.findByIdAndUpdate(req.user._id, {
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
