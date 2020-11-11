//REACT IMPORTS
import React from 'react';

//AUTH
import Auth from '../../utils/auth.js';

//LINK
import { Link } from 'react-router-dom';

//STYLES
import './navStyles.css';

const Nav = () => {

  function displayNav() {
    if (Auth.loggedIn()) 
    {
      return (
        <section
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
          className="nav-container"
        >
          <div>
            <Link 
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none'
              }}
              className="nav-button"
            >
              <span
                style={{
                  textDecoration: 'none',
                  color: 'white',
                }}
              >
                Home
              </span>
            </Link>
          </div>
          <div>
            <a 
              href="/"
              style={{
                textDecoration: 'none',
                color: 'white',
                marginLeft: '5px'
              }}
              className="nav-button"
              onClick={() => {
                Auth.logout()
              }}
            >
              Logout
            </a>
          </div>
        </section>
      );
    } 
    else
    {
      return (
        <section 
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
          className="nav-container"
        >
          <div>
            <Link 
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                marginRight: '5px',
                marginLeft: '5px'
              }}
              className="nav-button"
            >
              Home
            </Link>
          </div>
          <div>
            <Link 
              to="/signup"
              style={{
                color: 'white',
                textDecoration: 'none',
                marginRight: '5px',
                marginLeft: '5px'
              }}
              className="nav-button"
            >
              Sign In
            </Link>
          </div>
          <div>
            <Link 
              to="/login"
              style={{
                color: 'white',
                textDecoration: 'none',
                marginLeft: '5px',
              }}
              className="nav-button"
            >
              Login
            </Link>
          </div>
        </section> 
      );
    }
  }

  return (
    <>
      <nav>
        {displayNav()}
      </nav>
    </>
  );
};

export default Nav;