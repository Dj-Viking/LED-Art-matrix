import React from "react";

// AUTH
import { Link } from "react-router-dom";
import Auth from "../utils/auth";

// LINK

// STYLES
import "./aux-styles/navStyles.css";

const Nav: React.FC = (): JSX.Element => {
  function displayNav(): JSX.Element {
    if (Auth.loggedIn()) {
      return (
        <section
          style={{
            display: "flex",
            justifyContent: "center"
          }}
          className="nav-container"
        >
          <div>
            <Link 
              to="/"
              style={{
                color: "white",
                textDecoration: "none"
              }}
              className="nav-button"
            >
              <span
                style={{
                  textDecoration: "none",
                  color: "white",
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
                textDecoration: "none",
                color: "white",
                marginLeft: "5px"
              }}
              className="nav-button"
              onClick={() => {
                Auth.logout();
              }}
            >
              Logout
            </a>
          </div>
        </section>
      );
    } 
    
      return (
        <section 
          style={{
            display: "flex",
            justifyContent: "center"
          }}
          className="nav-container"
        >
          <div>
            <Link 
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                marginRight: "5px",
                marginLeft: "5px"
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
                color: "white",
                textDecoration: "none",
                marginRight: "5px",
                marginLeft: "5px"
              }}
              className="nav-button"
            >
              Sign Up
            </Link>
          </div>
          <div>
            <Link 
              to="/login"
              style={{
                color: "white",
                textDecoration: "none",
                marginLeft: "5px",
              }}
              className="nav-button"
            >
              Login
            </Link>
          </div>
        </section> 
      );
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
