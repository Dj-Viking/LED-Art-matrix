//REACT IMPORTS
import React from 'react';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

//REDUX IMPORTS
import { useSelector, useDispatch } from 'react-redux';

//import actions for login formstate reducer
import {
  loginEmailChange,
  loginEmailCompleted,
  loginPasswordChange,
  loginPasswordCompleted
} from '../actions/login-form-actions';


const Login = () => {
  //OBSERVE GLOBAL LOGIN FORM STATE
  const loginFormState = useSelector(state => state.loginForm)
  console.log(loginFormState);
  //GRAB PIECE OF STATE
  const {
    email,
    emailIsComplete,
    password,
    passwordIsComplete
  } = loginFormState;

  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();

  function handleChange(event) {
    if (event.target.type === 'email') {
      dispatchREDUX(loginEmailChange(event.target.value));
      dispatchREDUX(loginEmailCompleted(event.target.value));
    }
    if (event.target.type === 'password') {
      dispatchREDUX(loginPasswordChange(event.target.value));
      dispatchREDUX(loginPasswordCompleted(event.target.value));
    }
  }

  function enableLogin() {

    if (emailIsComplete && passwordIsComplete) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <form>
      <input 
        type="email"
        name="email"
        id="email-login"
        onChange={handleChange}
        placeholder="Your Email"
      />
      <input 
        type="password"
        name="password"
        id="password-login"
        onChange={handleChange}
        placeholder="Your Password"
      />
      <button
        type="submit"
        disabled={enableLogin()}
      >
        Login
      </button>
    </form>
  );
};

export default Login;