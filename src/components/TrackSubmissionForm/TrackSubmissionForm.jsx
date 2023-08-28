import React, { useState } from 'react';
import axios from 'axios';

export default function TrackSubmissionForm({ roundId, userId }) {
  const [songURL, setSongURL] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/rounds/${roundId}/submit`, { songURL, userId });
      console.log('song submitted')
    } catch (error) {
      console.error(`Error submitting song: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={songURL}
        onChange={(e) => setSongURL(e.target.value)}
        placeholder="Enter Spotify URL"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
