//IMPORT REACT
import React, { useState, useEffect } from 'react';
import './rainbowV2/styles/style.css';
import './rainbowStart/styles/style.css';
import './waves/styles/style.css';
import './spiral/styles/style.css';
import './fourSpirals/styles/style.css';


//maybe disable some "paid presets?"

//future thought to translate the presets into DMX controls.

//or control the LEDs on the web app with MIDI or DMX

//AUTH
import Auth from '../../utils/auth.js';

//REDUX
import {useSelector, useDispatch} from 'react-redux';

//ACTIONS
import { 
  loadUserSplashConfig,
  presetSwitch,
  animationDelayChange,
  animationDurationChange,
  alphaFaderChange,
  invertSwitch//feature after signing up
} from '../../actions/led-actions';

const BigLedBox = () => {
  //functions to create the columns and rows to render


  //query first preset in the array of the user's
  // list of preset names, this will have all the animation parameter styles for 
  // each row of LEDs
  // this will trigger loadUserSplashConfig action on load 
  //(useEffect to wait until data arrives and execute dispatch action once data arrives
  // from graphql query

  //FIRST
  //WHEN USER SIGNS UP AND LOGS IN ENABLE BUTTONS
  
  //REDUX GLOBAL STATE
  const ledChangeState = useSelector(state => state.ledChange);
  console.log(ledChangeState);
  //REDUX piece of global state
  const {
    // alpha,
    presetName,
    // animationDurationState,
    // _animationDelayState,

  } = ledChangeState;
  
  const dispatchREDUX = useDispatch();

  // const [animationDelayState, setAnimationDelayState] = useState(0);
  // function animationDelaySliderChange(event) {
  //   setAnimationDelayState(event.target.value);
  //   // console.log(((event.target.value) / 100).toString());
  //   dispatchREDUX(animationDelayChange((event.target.value / 100).toString()));
  // } 

  // const [animationSpeedState, setAnimationSpeedState] = useState(0);
  
  // function animationSpeedSliderChange(event) {
  //   setAnimationSpeedState(event.target.value);
  //   dispatchREDUX(animationDurationChange((event.target.value / 100).toString()));
  // }

  function handleSaveDefault(event) {
    event.preventDefault();
    event.persist();
  }


  // useEffect(() => {

  // }, [animationDurationState])

  /**
   * array of led objects that only contain the information needed
   * use .map() in react to create elements with unique keys
   * react needs key properties on JSX in order to clean up during
   * mounting and unmounting elements
   */
  //eslint-disable-next-line
  let leds_info;
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

  /**
   * array of row objects only containing information for
   * react to use .map() and make unique keys for the
   * JSX elements and contain a horizontal rows of leds
   * in each row the nested .map() is inserting all 32 leds
   * into a single rows.map() iteration.
   * 
   * 32 rows, 32 leds per row
   * 
   * 32x32 2D grid
   */
  // eslint-disable-next-line
  let rows_info;
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
    <>
    <main className="box-style">
      {/* <div className="slidecontainer">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={animationDelayState} 
          className="slider" 
          id="myRange"
          onChange={animationDelaySliderChange}
        />
        <p style={{color: 'white'}}>animation delay: {animationDelayState}</p> */}
        {/* <input 
          type="range" 
          min="0" 
          max="100" 
          value={animationSpeedState} 
          className="slider" 
          id="myRange"
          onChange={animationSpeedSliderChange}
        />
        <p style={{color: 'white'}}>animation speed: {animationSpeedState}</p>
      </div> */}
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
      <button
        disabled={Auth.loggedIn() ? false : true}//enable if logged in
        onClick={() => {
          dispatchREDUX(presetSwitch('waves'))
        }}
      >
        waves
      </button>
      <button
        className="tooltip"
        disabled={Auth.loggedIn() ? false : true }//enable if logged in
        onClick={() => {
          dispatchREDUX(presetSwitch('spiral'))
        }}
      >
      spiral 
      </button>
      <button
        disabled={Auth.loggedIn() ? false : true}//enable if logged in
        onClick={() => {
          dispatchREDUX(presetSwitch('fourSpirals'))
        }}
      >
        fourSpirals
      </button>

      {/* save as new login preset */}
      <button
        disabled={Auth.loggedIn() ? false : true}//enable if logged in
        style={{
          float: 'right'
        }}
        onClick={() => {
          //function for launching the save as default graphql mutation function for the user
          console.log('saving preset to user start')
        }}
      >
        Save as Default Preset
      </button>
      {
        rows.map((row, index) => (
          <div key={`row${index + 1}`} className={`row${index + 1}`}>
            {
              leds.map((led, index) => (
                <div 
                  key={`led${led.ledNumber}-${index + 1}`} 
                  className={`led${index + 1}-${row.rowNumber}${presetName}`}
                  style={{
                    // animationDuration: `${(index / 64) + ( index / row.rowNumber * (.05 * index))}`,
                    // animationDelay: `${(index / 16) + index / (row.rowNumber / index - (4 * row.rowNumber))}`
                  }}
                ></div>
              ))
            }
          </div>
        ))
      }
    </main>
    </>
  );
};

export default BigLedBox;