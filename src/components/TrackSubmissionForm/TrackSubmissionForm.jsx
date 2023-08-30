import React, { useState } from 'react';
import axios from 'axios';

export default function TrackSubmissionForm({ roundId, userId, onSuccess }) {
  const [songURL, setSongURL] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validateURL = (url) => {
    const pattern = /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]{22}\?si=[a-zA-Z0-9]+$/;
    return pattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateURL(songURL)) {
      try {
        await axios.post(`/api/rounds/${roundId}/submit`, { songURL, userId });
        console.log('song submitted');
        onSuccess();
      } catch (error) {
        console.error(`Error submitting song: ${error}`);
      }
    } else {
      setIsValid(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={songURL}
        onChange={(e) => {
          setSongURL(e.target.value);
          setIsValid(true); // Reset validation state upon input change
        }}
        placeholder="Enter Spotify URL"
      />
      <button type="submit">Submit</button>
      {!isValid && <p>songs must be submitted in URL format like this https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=6d48998463ff4bac</p>}
    </form>
  );
}
