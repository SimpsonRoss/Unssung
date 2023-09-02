import { useState } from 'react';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import LoginForm from '../../components/LoginForm/LoginForm';
import './AuthPage.css';


export default function AuthPage({ setUser }) {
  const [showSignUp, setShowSignUp] = useState(false);
  return (
    <section className='darkCenter authMargin'>
      <h1 className='light'>Unssung</h1>
      <h3 className='light'>The best tracks you've never heard.</h3>
      <br />
      <p className='light'>please sign in or sign up to begin playing.</p>
      <br />
      { showSignUp ?
          <SignUpForm setUser={setUser} />
          :
          <LoginForm setUser={setUser} />
      }
      <br />
      
     <p className='light'>or </p>
      <button className="btn btn-outline-light" type="button" onClick={() => setShowSignUp(!showSignUp)}>{showSignUp ? 'LOG IN' : 'SIGN UP'}</button>

    </section>
  );
}