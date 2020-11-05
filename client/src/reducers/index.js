import isLoggedIn from './isLoggedIn.js';
import ledChangeReducer from './ledChange.js';
import sketchOneReducer from './sketchOne.js';
import sketchTwoReducer from './sketchTwo.js';
import loginFormReducer from './loginFormReducer.js';
import signupFormReducer from './signupFormReducer.js';
import { combineReducers } from 'redux';

const allReducers = combineReducers(
  {
    isLoggedIn: isLoggedIn,
    ledChange: ledChangeReducer,
    sketchOne: sketchOneReducer,
    sketchTwo: sketchTwoReducer,
    loginForm: loginFormReducer,
    signupForm: signupFormReducer
  }
)

export default allReducers;