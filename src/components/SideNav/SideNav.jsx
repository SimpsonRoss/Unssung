// // src/components/SideNav/SideNav.jsx

// import { Link } from "react-router-dom";
// import { Routes, Route, Navigate } from 'react-router-dom';
// import * as userService from "../../utilities/users-service";
// import './SideNav.css';


// export default function NavBar({ user, setUser }) {
//   function handleLogOut() {
//     userService.logOut();
//     setUser(null);
//   }
  
//   return (
//     <div id="wrapper">


//       <div id="testRow"> 

//       <nav id="sidebar">
//         <div class="sidebar-header">
//           <h3>Hi { user.name }!</h3>
//         </div>
      
//         <ul class="list-unstyled components">
//           <p>Dummy Heading</p>
//           {/* <li ><Link to={"/dash"}>Dash</Link></li> */}
//           <li><Link to={"/games"}>All Games</Link></li>
//           <li><Link to="" onClick={handleLogOut}>Log Out</Link></li>
//         </ul>
//       </nav>

//       <div id="pageContent">
//         <p>Main Page Content</p>
//       </div>

//       </div>

//       <nav class="navbar fixed-bottom navbar-expand-lg bg-black">
//             <div class="container-fluid">

//                 <button type="button" id="sidebarCollapse" className="btn btn-outline-light">
//                     <i class="fas fa-align-left"></i>
//                     <span>Toggle</span>
//                 </button>
//                 {/* <div className="QuickNavCircle"><Link to={"/dash"}>Dash</Link></div> */}
//                 <div className="QuickNavCircle"><Link to={"/games"}>All Games</Link></div>
//                 <div className="QuickNavCircle"><Link to={"/games"}>New Game</Link></div>
//                 <div className="QuickNavCircle"><Link to={"/account"}>Account</Link></div>
//             </div>
//       </nav>


//     </div>
//   );
// }