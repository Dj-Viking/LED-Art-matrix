//REACT IMPORTS
import React from 'react';

//AUTH
import Auth from '../../utils/auth.js';

//LINK
import { Link } from 'react-router-dom';

const Nav = () => {

  function displayNav() {
    if (Auth.loggedIn()) {
      return (
        <ul className="flex-row">
          <li style={{color: 'white'}}>
            <Link to="/">
              Home
            </Link>
          </li>
          <li>
            <a 
              href="/"
              onClick={() => {
                Auth.logout()
              }}
            >
              Logout
            </a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="flex-row">
          <li style={{color: 'white'}}>
            <Link to="/">
              Home
            </Link>
          </li>
          <li style={{color: 'white'}}>
            <Link to="/signup">
              Sign Up
            </Link>
          </li>
          <li style={{color: 'white'}}>
            <Link to="/login">
              Login
            </Link>
          </li>
        </ul> 
      );
    }
  }

  return (
    <>
      <div 
        style={{color: 'white'}}
      >
      </div>

      <nav>
        {displayNav()}
      </nav>
    </>
  );
};

export default Nav;