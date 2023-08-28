// src/pages/App/App.jsx

import { useState, useEffect } from 'react';
import { getUser } from '../../utilities/users-service';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchUserGames } from '../../utilities/games-api';
import './App.css';
import AuthPage from '../AuthPage/AuthPage';
import AllGamesPage from '../AllGamesPage/AllGamesPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import Dash from '../DashPage/DashPage';

import SideNav from '../../components/SideNav/SideNav';
import QuickNav from '../../components/QuickNav/QuickNav';
import GameDetailPage from '../GameDetailPage/GameDetailPage';
import RoundDetailPage from '../RoundDetailPage/RoundDetailPage';


export default function App() {
  const [user, setUser] = useState(getUser());
  const [games, setGames] = useState([]);


  useEffect(() => {
    async function getGames() {
      if (user) {
        const fetchedGames = await fetchUserGames().catch((e) => console.error(e));
        setGames(fetchedGames);
      } else {
        console.log('no user to getGames from');
      }
      
    }
    getGames();
  }, [user]);
  

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
              <Route path="/games" element={<AllGamesPage games={games} setGames={setGames} />} />
              <Route
              path="/games/:id"
              element={<GameDetailPage games={games} setGames={setGames} />}
              />
              <Route
              path="/rounds/:id"
              element={<RoundDetailPage user={user} />}
              />
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

