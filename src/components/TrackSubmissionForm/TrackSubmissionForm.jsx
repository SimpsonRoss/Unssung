import React, { useState } from 'react';
import axios from 'axios';

export default function TrackSubmissionForm({ roundId, userId, onSuccess }) {
  const [songURL, setSongURL] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validateURL = (url) => {
    const pattern1 = /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]{22}\?si=[a-zA-Z0-9]+$/;
    // const pattern2 = /^https:\/\/spotify\.link\/[a-zA-Z0-9]+$/;
    return pattern1.test(url) 
    // || pattern2.test(url)
    ;
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
    <form className="darkCenter d-flex flex-column align-items-center" autoComplete="off" onSubmit={handleSubmit}>
      <h4 className='text-light mt-3'>Submit a valid Spotify URL</h4>
      <div className="form-floating mt-1 inputBox justify">
        <input 
          className='form-control mt-2 w-100'
          name="songURL"
          type="text" 
          placeholder='URL'
          required
          value={songURL}
          onChange={(e) => {
            setSongURL(e.target.value);
            setIsValid(true); // Reset validation state upon input change
          }}
        />
        <label>Spotify song URL</label>
      </div>
      <br />
      <button className='btn btn-outline-light mb-4 inputBox' type="submit">Submit</button>
      {!isValid && <p className='px-4 text-warning'>Please submit a song using a valid Spotify URL format (from Spotify Desktop or Web App).</p>}
    </form>
  );
}
