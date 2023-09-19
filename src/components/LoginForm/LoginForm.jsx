// src/components/LoginForm/LoginForm.jsx

import { useState } from 'react';
import * as usersService from '../../utilities/users-service';

export default function LoginForm({ setUser }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError('');
  }

  async function handleSubmit(evt) {
    // Prevent form from being submitted to the server
    evt.preventDefault();
    try {
      // The promise returned by the signUp service method 
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await usersService.login(credentials);
      setUser(user);
    } catch {
      setError('Log in failed. Please try again.');
    }
  }

  return (
    <div>
      <div>
        <form className="darkCenter" autoComplete="off" onSubmit={handleSubmit}>

          <div className="form-floating mb-3">
            <input type="text" className="form-control" name="email" value={credentials.email} onChange={handleChange} placeholder='user@example.com' required/>
            <label>Email</label>
          </div>

          <div className="form-floating mb-3">
            <input type="password" className="form-control" name="password" value={credentials.password} onChange={handleChange} placeholder='Password' required />
            <label>Password</label>
          </div>

          <button className="btn btn-outline-light" type="submit">LOG IN</button>

        </form>
      </div>
      {error ? <p className="error-message mt-2 text-danger">&nbsp;{error}</p> : null}
      {/* <p className="error-message">&nbsp;{error}</p> */}
    </div>
  );
}


