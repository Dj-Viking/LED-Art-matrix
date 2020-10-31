//IMPORT REACT
import React from 'react';
import './style.css';

//REDUX
import {useSelector} from 'react-redux';

//ACTIONS
// import { 
//   loadUserSplashConfig,
//   fadeUpRed,
//   fadeDownRed,
//   fadeUpGreen,
//   fadeDownGreen,
//   fadeUpBlue,
//   fadeDownBlue
// } from '../../actions/led-actions';

const BigLedBox = () => {
  const ledChangeState = useSelector(state => state.ledChange);
  console.log(ledChangeState);
  // const dispatchREDUX = useDispatch();
  return (
    <main className="box-style">
      box
    </main>
  );
};

export default BigLedBox;