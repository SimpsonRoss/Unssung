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
  

  return (
    <>
      <div id="wrapper">

      <div id="testRow"> 

      { user ?  
      <nav id="sidebar">
        <div className="sidebar-header">
          {/* <h3>Hi { user.name }!</h3> */}
          <h3>Hi there!</h3>
        </div>

        <ul className="list-group list-group-flush">
          <p>Welcome to TRKR8!</p>
          {/* <li ><Link to={"/dash"}>Dash</Link></li> */}
          <li className='list-group-item-dark'><Link to={"/games"}>All Games</Link></li>
          <li className='list-group-item-dark'><Link to={"/games"}>New Game</Link></li>
          <li className='list-group-item-dark'><Link to="" onClick={handleLogOut}>Log Out</Link></li>
          <br/>
          <br/>
          <br/>
          
          <a href="#" className="list-group-item-dark list-group-item-action border">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">Create New Game</h5>
             </div>
            <p className="mb-1">create a new game and get playing!</p>
          </a>
          <br/>
          <a href="#" className="list-group-item-dark list-group-item-action border">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">Join a Game</h5>
             </div>
            <p className="mb-1">enter code to join a friends game!</p>
          </a>
        </ul>
      </nav> : null }

      <div id="pageContent">
          { user ?  
      <main className='MainApp'>
        <>
            <Routes>
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
        </>
      </main>
      : 
      <AuthPage setUser={setUser} /> } 
      </div>

    </div>

    { user ? 
    <nav className="navbar fixed-bottom navbar-expand-lg bg-black">
      <div className="container-fluid">

          <button type="button" id="sidebarCollapse" className="btn btn-outline-light">
              <i className="fas fa-align-left"></i>
              <span>Toggle</span>
          </button>
          {/* <div className="QuickNavCircle"><Link to={"/dash"}>Dash</Link></div> */}
          <div className="QuickNavCircle"><Link to={"/games"}>All Games</Link></div>
          <div className="QuickNavCircle"><Link to={"/games"}>New Game</Link></div>
          <div className="QuickNavCircle"><Link to={"/account"}>Account</Link></div>
      </div>
    </nav> : null }
  </div>
     
      {/* <footer className='darkCenter'>
        <p>footer</p>
      </footer> */}
    </>
  );
}

