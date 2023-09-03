import { useState } from 'react';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import LoginForm from '../../components/LoginForm/LoginForm';
import './AuthPage.css';


export default function AuthPage({ setUser }) {
  const [showSignUp, setShowSignUp] = useState(false);
  return (
    <section className='darkCenter authMargin'>
      {/* <h1 className='light'>Unssung</h1> */}
      <img src="/unssung-logo.png" alt="Unssung Logo" className="logo mb-3 mt-4 px-5" />
      <h4 className='light'>The best tracks you've never heard.</h4>
      <br />
      <p className='light'>Log in or sign up to begin playing.</p>
      { showSignUp ?
          <SignUpForm setUser={setUser} />
          :
          <LoginForm setUser={setUser} />
      }
      <br />
      
     <p className='light mb-4'>or </p>
      <button className="btn btn-outline-light" type="button" onClick={() => setShowSignUp(!showSignUp)}>{showSignUp ? 'LOG IN' : 'SIGN UP'}</button>

    </section>
  );
}