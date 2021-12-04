//REACT IMPORTS
import React, { useState } from 'react';

//AUTH
import Auth from '../utils/auth.js';
import API from "../utils/ApiService";
//REDUX IMPORTS
import { useSelector, useDispatch } from 'react-redux';

//GRAPHQL IMPORTS


//ACTIONS IMPORT for signup formstate reducer
import {
  signupUsernameChange,
  signupUsernameCompleted,
  signupEmailChange,
  signupEmailCompleted,
  signupPasswordChange,
  signupPasswordCompleted
} from '../actions/signup-form-actions';

const Signup = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //OBSERVE GLOBAL SIGNUP FORM STATE
  const signupFormState = useSelector(state => state.signupForm);
  //console.log(signupFormState);
  //GRAB PIECE OF STATE
  const {
    username,
    email,
    password,
    //usernameIsComplete,
    //emailIsComplete,
    //passwordIsComplete
  } = signupFormState;
  
  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();
  
  //FUNCTION TO HANDLE FORM SUBMIT TO GRAPHQL MUTATION
  async function handleSubmit(event){
    event.preventDefault();
    setLoading(true);
    try {
      if (window.navigator.onLine) {
        await API.signup({ username, email, password });
        setLoading(false);
      } else {
        setError("\nInternet is disconnected, please try again later");
      }
    } catch(err) {
      setLoading(false);
      setError(err.message);
      console.log("error when signing up", err);
    }
  } 

  function handleChange(event) {
    if (event.target.type === 'text') {
      dispatchREDUX(signupUsernameChange(event.target.value));
      dispatchREDUX(signupUsernameCompleted(event.target.value));
    }
    if (event.target.type === 'email') {
      dispatchREDUX(signupEmailChange(event.target.value));
      dispatchREDUX(signupEmailCompleted(event.target.value));
    }
    if (event.target.type === 'password') {
      dispatchREDUX(signupPasswordChange(event.target.value));
      dispatchREDUX(signupPasswordCompleted(event.target.value));
    }
  }

  return (
    <>
    <div
      className="form-container"
    >
      <form 
        className="form-card"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="username"
          className="form-username-label"
        >
          Username:
        </label>
        <input
          required 
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="my_username"
          className="form-username-input"
          autoComplete="off"
        />
        <label
          htmlFor="email"
          className="form-email-label"
        >
          Email:
        </label>
        <input 
          required
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="example@email.com"
          className="form-email-input"
          autoComplete="off"
        />
        <label
          htmlFor="password"
          className="form-password-label"
        >
          Password:
        </label>
        <input 
          required
          className="form-password-input"
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="***************"
          autoComplete="off"
        />
        {
          error 
          ?
          (
            <>
              <div
                style={{color: 'red'}}
              >
                An error happened during the signup process!
                {error}
              </div>
            </>
          )
          : null
        }
        <div
          className="form-button-container"
        >
          <button
            type="submit"
            disabled={false}
            className ='form-btn'
          >
            Sign Up
          </button>
        {
          loading 
          ?
          <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          : null
        }
        </div> 
      </form>
    </div>
    </>
  );
};

export default Signup;