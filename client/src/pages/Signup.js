//REACT IMPORTS
import React from 'react';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations.js';
import Auth from '../utils/auth.js';

//REDUX IMPORTS
import { useSelector, useDispatch } from 'react-redux';


//import actions for signup formstate reducer
import {
  signupUsernameChange,
  signupUsernameCompleted,
  signupEmailChange,
  signupEmailCompleted,
  signupPasswordChange,
  signupPasswordCompleted
} from '../actions/signup-form-actions';

const Signup = () => {
  //OBSERVE GLOBAL SIGNUP FORM STATE
  const signupFormState = useSelector(state => state.signupForm);
  console.log(signupFormState);
  //GRAB PIECE OF STATE
  const {
    username,
    email,
    password,
    usernameIsComplete,
    emailIsComplete,
    passwordIsComplete
  } = signupFormState;

  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();

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

  function enableSignup() {
    if (
      usernameIsComplete && 
      emailIsComplete && 
      passwordIsComplete
    ) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <>
      <form>
        <input 
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="Username"
        />
        <input 
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
        />
        <input 
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <button
          type="submit"
          disabled={enableSignup()}
        >
          Sign Up!
        </button>
      </form>
    </>
  );
};

export default Signup;