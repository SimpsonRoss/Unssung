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
import { Link } from "react-router-dom";
import * as userService from "../../utilities/users-service";
import '../../components/SideNav/SideNav.css';

import SideNav from '../../components/SideNav/SideNav';
import QuickNav from '../../components/QuickNav/QuickNav';
import GameDetailPage from '../GameDetailPage/GameDetailPage';
import RoundDetailPage from '../RoundDetailPage/RoundDetailPage';


export default function App() {
  const [user, setUser] = useState(getUser());
  const [games, setGames] = useState([]);

  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }


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

  const greetings = [
    'Hola', // Spanish
    'Bonjour', // French
    'Hallo', // German
    'Ciao', // Italian
    'Olá', // Portuguese
    'Hej', // Swedish
    'Howdy',
    'Oi',
    'Aloha',
    'Heya',
    'Sup',
    'Yo',
    'Hi',
    'EhUp',
    'Salut',
    'Hei',
    'Zdrav',
  ];

  const getRandomGreeting = () => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  };
  

  return (
    <>
      <div id="wrapper">

      <div id="testRow"> 

      { user ?  
      <nav id="sidebar">
        <div className="sidebar-header">
          <h3>{getRandomGreeting()} { user.name }!</h3>
        </div>

        <ul className="list-group list-group-flush">
          <p>It's time to kick ass and share music, and I'm all outa music!</p>
          <br/>
          <li className='list-group-item-dark'><Link className="custom-hover" to={"/games"}> 
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
            </svg>
            &nbsp;&nbsp;
            Games Dashboard</Link></li>
          <li className='list-group-item-dark'><Link className="custom-hover" to={"/account"}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
          &nbsp;&nbsp;
            Account Page</Link></li>
          <li className='list-group-item-dark'><Link className="custom-hover" to="" onClick={handleLogOut}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
  <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
</svg>
&nbsp;&nbsp;
            Log Out</Link></li>
          <br/>
          <br/>
          <br/>
          
          <li className='list-group-item-dark border mx-2'>
            <Link to="/create-game" className="custom-hover">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>  
            &nbsp;&nbsp; 
                  New Game</h5>
              </div>
              <p className="mb-1 ">Create a new game and get playing!</p>
            </Link>
          </li>
          <br/>
          <li className='list-group-item-dark border mx-2'>
            <Link to="/join-game" className="custom-hover">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>  
            &nbsp;&nbsp; 
                Join Game</h5>
              </div>
              <p className="mb-1">Enter code to join a friend's game!</p>
            </Link>
          </li>
        </ul>
      </nav> : null }

      <div id="pageContent">
          { user ?  
      <main className='MainApp'>
        <>
            <Routes>
              <Route path="/" element={<AllGamesPage games={games} setGames={setGames} />} />

              {/* <Route path="/"><Redirect to="/games" /></Route> */}

              <Route path="/games" element={<AllGamesPage games={games} setGames={setGames} />} /> 
              {/* FIND ALL PLACES WITH /GAMES AND REMOVE ^^^ */}
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
        </>
      </main>
      : 
      <AuthPage setUser={setUser} /> } 
      </div>

    </div>

    {/* { user ?  */}
    <nav className={`navbar fixed-bottom navbar-expand-lg bg-black pe-5 ${user ? '' : 'hidden' }`}>

      <div className="container-fluid">

          <button type="button" id="sidebarCollapse" className="btn btn-outline-light">
            {/* TOGGLE */}
              <i className="fas fa-align-left"></i>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
              </svg>
          </button>
          <div><Link to={"/games"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" className="bi bi-house" viewBox="0 0 16 16">
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
            </svg>
            </Link></div>
          <div><Link to={"/games"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-plus-square" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>         
          </Link></div>
          <div><Link to={"/account"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
          </Link></div>
      </div>
    </nav> 
    {/* : null } */}
  </div>
     
      {/* <footer className='darkCenter'>
        <p>footer</p>
      </footer> */}
    </>
  );
}

