//IMPORT REACT
import React, { useState, useEffect } from 'react';
import './rainbowV2/styles/style.css';
import './rainbowStart/styles/style.css';

//REDUX
import {useSelector, useDispatch} from 'react-redux';

//ACTIONS
import { 
  loadUserSplashConfig,
  presetSwitch,
  animationDelayChange,
  animationDurationChange,
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
  
  //REDUX GLOBAL STATE
  const ledChangeState = useSelector(state => state.ledChange);
  console.log(ledChangeState);
  //REDUX piece of global state
  const {
    alpha,
    isAnimating,
    presetName,
    animationDurationState,
    animationDelay
  } = ledChangeState;
  
  const dispatchREDUX = useDispatch();

  const [animationDelayState, setAnimationDelayState] = useState(0);
  function animationDelaySliderChange(event) {
    setAnimationDelayState(event.target.value);
    // console.log(((event.target.value) / 100).toString());
    dispatchREDUX(animationDelayChange((event.target.value / 100).toString()));
  } 

  const [animationSpeedState, setAnimationSpeedState] = useState(0);
  
  function animationSpeedSliderChange(event) {
    setAnimationSpeedState(event.target.value);
    dispatchREDUX(animationDurationChange((event.target.value / 100).toString()));
  }
  useEffect(() => {

  }, [animationDurationState])

  const leds = [];
  function createLedObjectsArray() {
    for (let i = 1; i < 33; i++) {
      leds.push(
        // <>
        //   <div
        //    className={`led${i}-${num}`}
        //    key={`led${i}-${num}`}
        //   ></div>
        // </>
        {
          ledNumber: i,
          ledRowNumber: 33 - i
        }
      );
    }
    // console.log(leds);
    return leds;
  }
  // const createLeds = (num) => {
  //   elementText = '';
  //   for (let i = 1; i < 33; i++) {
  //     elementText += `
  //       <div class="led${i}-${num}"></div>
  //     `;
  //   };
  //   return elementText;
  // }

  // {
  //   leds.map((led, index) => (
  //     <div className={`led${i}-${index + 1}`} key={`led${i}-${index + num}`}></div>
  //   ))
  // }

  const rows = [];
  function createLedRowsArray(num) {
    for (let i = 1; i < num; i++) {
      rows.push(
        {
          rowNumber: i
        }
      );
    }
    // console.log(rows);
    return rows;
  }
  // const createRows = (num) => {
  //   let elementText = '';
  //   for ( let i = 1; i < num; i++ ){
  //     elementText += `
  //     <div class="row${i}">
  //       ${createLeds(i)}
  //     </div>
  //     `
  //   }
  //   return elementText;
  // };


  createLedObjectsArray(33);
  createLedRowsArray(33);
  return (
    <main className="box-style">
      <div className="slidecontainer">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={animationDelayState} 
          className="slider" 
          id="myRange"
          onChange={animationDelaySliderChange}
        />
        <p style={{color: 'white'}}>animation delay: {animationDelayState}</p>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={animationSpeedState} 
          className="slider" 
          id="myRange"
          onChange={animationSpeedSliderChange}
        />
        <p style={{color: 'white'}}>animation speed: {animationSpeedState}</p>
      </div>
      <button
        onClick={() => {
          dispatchREDUX(presetSwitch(''))
        }}
      >
        rainbowTest
      </button>
      <button
        onClick={() => {
          dispatchREDUX(presetSwitch('V2'))
        }}
      >
        rainbowV2
      </button>
      {
        rows.map((row, index) => (
          <div key={`row${index + 1}`} className={`row${index + 1}`}>
            {
              leds.map((led, index) => (
                <div 
                  key={`led${led.ledNumber}-${index + 1}`} 
                  className={`led${index + 1}-${row.rowNumber}${presetName}`}
                  style={{animationDuration: `${animationDurationState}`}}
                ></div>
              ))
            }
          </div>
        ))
      }
    </main>
  );
};

export default BigLedBox;