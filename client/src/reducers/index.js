import isLoggedIn from './isLoggedIn.js';
import ledChangeReducer from './ledChange.js';
import sketchOneReducer from './sketchOne.js';
import sketchTwoReducer from './sketchTwo.js';
import { combineReducers } from 'redux';

const allReducers = combineReducers(
  {
    isLoggedIn: isLoggedIn,
    ledChange: ledChangeReducer,
    sketchOne: sketchOneReducer,
    sketchTwo: sketchTwoReducer
  }
)

export default allReducers;