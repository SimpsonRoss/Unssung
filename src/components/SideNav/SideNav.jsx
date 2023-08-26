// src/components/SideNav/SideNav.jsx

import { Link } from "react-router-dom";
import { Routes, Route, Navigate } from 'react-router-dom';
import * as userService from "../../utilities/users-service";
import './SideNav.css';


export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }
  
  return (
    <nav className="SideNavBox">
      <h2>Hi { user.name }!</h2>
      <ul>
        <li><Link to={"/dash"}>Dash</Link></li>
        <li><Link to={"/games"}>All Games</Link></li>
        <li><Link to="" onClick={handleLogOut}>Log Out</Link></li>
      </ul>
    </nav>
  );
}