// eslint-disable-next-line
// @ts-ignore
import React from "react";

// REDUX
// import { useSelector, useDispatch } from 'react-redux';

// ACTIONS

// AUTH
import Auth from "../utils/auth";

// GRAPHQL APOLLO

// COMPONENTS
import Nav from "./Nav";

// this will be the page the new user sees when they login

// message for the disabled buttons style
// animation that flies in some crazy way to alert
// user that the disabled presets will be enabled after login. 
// import './messageForButtons/styles/style.css';
// some kind of 

// splash header will have p5 sketch of something cool not sure yet.
// 

const SplashHeader = (): JSX.Element => (
  <>
    {/* // for these conditional elements could use some kind of style animation that fades in and out some RGB shadow behind the button and around the button itself or the text highlighted after the previous animation the greyed out button presets */}
    {
        Auth.loggedIn()
        ? (
          <>
            <div 
              style={{
                color: "white",
                textAlign: "center"
              }}
            >
              LED Art Matrix
            </div>
          </>
        )
        : (
          <>
            <div 
              style={{
                color: "white",
                textAlign: "center"
              }}
            >
              LED Art Matrix
            </div>
          </>
        )
      }
    {/* // option to login signup */}
    <Nav />
  </>
  );
// 
// show preview of the led controls with disabled buttons

export default SplashHeader;
