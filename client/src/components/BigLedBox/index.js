//IMPORT REACT
import React, { useEffect, useCallback } from 'react';

//REACT SPRING
import { useSpring, animated } from 'react-spring';
import { 
  _V2ButtonSpring, 
  _rainbowButtonSpring, 
  _wavesButtonSpring, 
  _spiralButtonSpring, 
  _fourSpiralsButtonSpring, 
  _saveButtonSpring 
} from "../SpringButtons";

//STYLES
import './rainbowV2/styles/style.scss';
import './rainbowStart/styles/style.scss';
import './waves/styles/style.scss';
import './spiral/styles/style.scss';
import './fourSpirals/styles/style.scss';
import './ledLayoutStyle.css'

//COMPONENTS
import ArtScroller from '../ArtScroller';


//maybe disable some "paid presets?"

//future thought to translate the presets into DMX controls.

//or control the LEDs on the web app with MIDI or DMX

//AUTH
import Auth from '../../utils/auth.js';
import API from "../../utils/ApiService";

//REDUX
import {useSelector, useDispatch} from 'react-redux';

//ACTIONS
import { 
  presetSwitch,
} from '../../actions/led-actions';

const BigLedBox = () => {
  const V2ButtonSpring          = useSpring(_V2ButtonSpring);
  const rainbowButtonSpring     = useSpring(_rainbowButtonSpring);
  const wavesButtonSpring       = useSpring(_wavesButtonSpring);
  const spiralButtonSpring      = useSpring(_spiralButtonSpring);
  const fourSpiralsButtonSpring = useSpring(_fourSpiralsButtonSpring);
  const saveButtonSpring        = useSpring(_saveButtonSpring); 


  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();
   //REDUX GLOBAL STATE
   const ledChangeState = useSelector(state => state.ledChange);
   //console.log(ledChangeState);
 
   //REDUX piece of global state
   const {
     presetName,
   } = ledChangeState;

  /**
   * @returns {string}
   */
  const getPreset = useCallback(async () => {
    try {
      const preset = await API.getDefaultPreset(Auth.getToken());
      if (typeof preset === "string") return preset;
      else throw new TypeError(`preset returned was not a string! it's value was ${preset}`);
    } catch (error) {
      console.error("error when getting default preset in use callback", error);
    }
  }, [])

  //function that sets the starting preset name of the user logging on
  // conditionally render whether they are logged on => load with that default preset
  // : else load the blank preset name
  useEffect(() => {
    async function awaitThePresetCallback() {
      const preset = await getPreset();
      if (preset) {
        dispatchREDUX(presetSwitch(preset))
      }
    }
    awaitThePresetCallback();
    return void 0;
  }, [getPreset, presetName, dispatchREDUX]);
  
 
  
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

  async function handleSaveDefault(event) {
    event.preventDefault();
    event.persist();
    // get the classname string split from the classname
    //console.log(event.target.parentElement.parentElement.parentElement.children[1].firstChild.firstChild.className.split('led1-1')[1]);
    let presetString = 
      event
      .target
        .parentElement
          .parentElement
            .parentElement
              .children[1]
                .firstChild
                  .firstChild
                  .className
                  .split('led1-1')[1];
    //check the presetdata from the query to get the preset ID to save to the user
    // that matches the preset name acquired from the event
    
  }

  createLedObjectsArray(33);
  createLedRowsArray(33);
  
  return (
    <>
      <main className="box-style">
        <section 
          style={{
            position: 'relative',
            display: 'flex',
            textAlign: 'center',
            flexDirection: 'column'
          }}
        >
          <ArtScroller />
          <div className="border-top-led"></div>
          <span 
            style={{
              color: 'white',
              textAlign: 'center'
            }}
          >
            LED Matrix Presets
          </span>
          {
            !Auth.loggedIn()
            &&
            (
              <>
                <span
                  style={{
                    color: 'white'
                  }}
                >
                  To see the Disabled Presets, Log in or Sign up to use those and also save your own Default login Preset!
                </span>
              </>
            )
          }
          <div
            className="preset-button-container"
            // style={{
            //   display: 'flex',
            // }}
          >
            <animated.button
              style={rainbowButtonSpring}
              className="preset-button rainbow-anim"
              onClick={() => {
                dispatchREDUX(presetSwitch(''))
              }}
            >
              <span
                className="preset-button-text"
              >
                rainbowTest
              </span>
            </animated.button>
            <animated.button
              style={V2ButtonSpring}
              className="preset-button"
              onClick={() => {
                dispatchREDUX(presetSwitch('V2'))
              }}
            >
              <span
                className="preset-button-text"
                style={{width: '100%'}}
              >
                V2
              </span>
            </animated.button>
            <animated.button
              style={wavesButtonSpring}
              className={Auth.loggedIn() ? `preset-button` : 'preset-button-disabled'}
              disabled={Auth.loggedIn() ? false : true}//enable if logged in
              onClick={() => {
                dispatchREDUX(presetSwitch('waves'))
              }}
            >
              <span
                className="preset-button-text"
              >
                waves
              </span>
            </animated.button>
            <animated.button
              style={spiralButtonSpring}
              className={Auth.loggedIn() ? 'preset-button' : 'preset-button-disabled'}
              disabled={Auth.loggedIn() ? false : true }//enable if logged in
              onClick={() => {
                dispatchREDUX(presetSwitch('spiral'))
              }}
            >
              <span
                className="preset-button-text"
              >
                spiral
              </span>
            </animated.button>
            <animated.button
              style={fourSpiralsButtonSpring}
              className={Auth.loggedIn() ? 'preset-button' : 'preset-button-disabled'}
              disabled={Auth.loggedIn() ? false : true}//enable if logged in
              onClick={() => {
                dispatchREDUX(presetSwitch('fourSpirals'))
              }}
            >
              <span
                className="preset-button-text"
              >
                fourSpirals
              </span>
            </animated.button>

            {/* save as new login preset */}
            <animated.button
              style={saveButtonSpring}
              className={Auth.loggedIn() ? 'preset-button save-button' : 'preset-button-disabled'}
              disabled={Auth.loggedIn() ? false : true}//enable if logged in
              onClick={handleSaveDefault}
            >
              Save as Default
            </animated.button>
          </div>
        </section>
        <section
          className="led-matrix-container"
        >
          {
            rows.map((row, index) => (
              <div 
                key={`row${index + 1}`} 
                className={`row${index + 1}`}
              >
                {
                  leds.map((led, index) => (
                    <div 
                      key={`led${led.ledNumber}-${index + 1}`} 
                      className={`led${index + 1}-${row.rowNumber}${Auth.loggedIn() ? presetName : presetName}`}
                      style={{
                        // animationDuration: `${(index / 64) + ( index / row.rowNumber * (.05 * index))}`,
                        // animationDelay: `${(index / 16) + index / (row.rowNumber / index - (4 * row.rowNumber))}`
                      }}
                    >
                    </div>
                  ))
                }
              </div>
            ))
          }
        </section>
      </main>
    </>
  );
};

export default BigLedBox;