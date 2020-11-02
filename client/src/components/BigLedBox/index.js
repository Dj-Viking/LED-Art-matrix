//IMPORT REACT
import React from 'react';
import './style.css';

//REDUX
import {useSelector} from 'react-redux';

//ACTIONS
import { 
  loadUserSplashConfig,
  presetSwitch,
  alphaFaderChange,
} from '../../actions/led-actions';

const BigLedBox = () => {
  //functions to create the columns and rows to render


  //query first preset in the array of the user's
  // list of preset names, this will have all the animation parameter styles for 
  // each row of LEDs
  // this will trigger loadUserSplashConfig action on load 
  //(useEffect to wait until data arrives and execute dispatch action once data arrives
  // from graphql query
  const ledChangeState = useSelector(state => state.ledChange);
  console.log(ledChangeState);
  //REDUX piece of global state
  const {
    alpha,
    isAnimating,
    presetname,
  } = ledChangeState;
  // const dispatchREDUX = useDispatch();
  return (
    <main className="box-style">
      box
    </main>
  );
};

export default BigLedBox;