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
      <nav>
        {displayNav()}
      </nav>
      <div style={{color: 'white'}}>nav</div>
    </>
  );
};

export default Nav;