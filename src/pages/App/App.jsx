// src/pages/App/App.jsx

import { useState } from 'react';
import { getUser } from '../../utilities/users-service';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthPage from '../AuthPage/AuthPage';
import AllGamesPage from '../AllGamesPage/AllGamesPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import Dash from '../DashPage/DashPage';

import SideNav from '../../components/SideNav/SideNav';
import QuickNav from '../../components/QuickNav/QuickNav';


export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <>
     { user ?  
      <main className='MainApp'>
        
        <>
          <aside>
            <QuickNav />
            <SideNav user={user} setUser={setUser} />
          </aside>
          <section>
            <Routes>
              <Route path="/dash" element={<Dash />} />
              <Route path="/games" element={<AllGamesPage />} />
              <Route path="/account" element={<ProfilePage user={user} setUser={setUser} />} />
            </Routes>
          </section>
        </>
      </main>
      : 
      <AuthPage setUser={setUser} /> } 
      <footer className='Footer'>
        <p>footer</p>
      </footer>
    </>
  );
}

