//IMPORT REACT
import React, { useEffect } from 'react';

//REACT SPRING
import {useSpring, animated} from 'react-spring';

//STYLES
import './rainbowV2/styles/style.css';
import './rainbowStart/styles/style.css';
import './waves/styles/style.css';
import './spiral/styles/style.css';
import './fourSpirals/styles/style.css';
import './ledLayoutStyle.css'

//COMPONENTS
import ArtScroller from '../ArtScroller';

//maybe disable some "paid presets?"

//future thought to translate the presets into DMX controls.

//or control the LEDs on the web app with MIDI or DMX

//APOLLO GRAPHQL QUERIES AND MUTATIONS
import {useQuery, useMutation} from '@apollo/react-hooks';
import {USER_QUERY, GET_PRESETS} from '../../utils/queries.js';
import {UPDATE_USER_DEFAULT_PRESET} from '../../utils/mutations.js';

//AUTH
import Auth from '../../utils/auth.js';

//REDUX
import {useSelector, useDispatch} from 'react-redux';

//ACTIONS
import { 
  //loadUserSplashConfig,
  presetSwitch,
  //animationDelayChange,
  //animationDurationChange,
  //alphaFaderChange,
  // eslint-disable-next-line
  //invertSwitch,//feature after signing up
  //savePresetName
} from '../../actions/led-actions';

const BigLedBox = () => {
  //springs
  const rainbowButtonSpring = useSpring({
    delay: 1000,
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    }
  });

  const V2ButtonSpring = useSpring({
    delay: 1300,
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  });

  const wavesButtonSpring = useSpring({
    delay: 1500,
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  });

  const spiralButtonSpring = useSpring({
    delay: 1700,
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  });

  const fourSpiralsButtonSpring = useSpring({
    delay: 2000,
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  });

  const saveButtonSpring = useSpring({
    delay: 2300,
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  });


  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();
  //functions to create the columns and rows to render

  //query get all presets in the database
  // const {presetData} = useQuery(GET_PRESETS);

  
  //execute function on first page load
  // get user default starting preset class name string
  const userQueryResponse = useQuery(USER_QUERY);
  // console.log('user query response');
  // console.log(userQueryResponse);

  const presetQueryResponse = useQuery(GET_PRESETS);
  // console.log('preset query response');
  // console.log(presetQueryResponse);

  //function that sets the starting preset name of the user logging on
  // conditionally render whether they are logged on => load with that default preset
  // : else load the blank preset name
  useEffect(() => {
    if (presetQueryResponse.data && userQueryResponse.data) 
    {
      //console.log('data arrived');
      //extract the data to compare whether the 
      //user default preset matches one in the 
      // preset list queried
      for (
        let i = 0; 
        i < presetQueryResponse.data.getPresets.length; 
        i++
      ) 
      {
        if (
          presetQueryResponse.data.getPresets[i]._id
          === userQueryResponse.data.user.defaultPreset
        ) 
        {//id matches
          // console.log("ID of the preset of the user");
          // console.log(userQueryResponse.data.user.defaultPreset);
          // console.log(presetQueryResponse.data.getPresets[i]);
          
          //dispatch action to switch to the default presetName
          // that matches the id given 
          dispatchREDUX(
            presetSwitch(
              presetQueryResponse.data.getPresets[i].presetName
            )
          );
        }
      }
    }
  }, [presetQueryResponse, userQueryResponse, dispatchREDUX]);
  
  //REDUX GLOBAL STATE
  const ledChangeState = useSelector(state => state.ledChange);
  //console.log(ledChangeState);

  //REDUX piece of global state
  const {
    // alpha,
    presetName,
    // animationDurationState,
    // _animationDelayState,

  } = ledChangeState;
  


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

  const [updateUserDefaultPreset] = useMutation(UPDATE_USER_DEFAULT_PRESET);
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
    for (
      let i = 0; 
      i < presetQueryResponse.data.getPresets.length; 
      i++
    ){
      if (
        presetString === 
        presetQueryResponse.data.getPresets[i].presetName  
      ){
        //console.log('found the preset');
        console.log(presetQueryResponse.data.getPresets[i].presetName);
        //use mutation
        try {
          await updateUserDefaultPreset
          (
            {
              variables: {
                _id: presetQueryResponse.data.getPresets[i]._id
              }
            }
          );
        } catch (error) {
          console.error(error);
        }
        console.log('preset saved');
      } else {
        console.log('updating...');
      }
    }
  }

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
                  To see the Disabled Presets, Log in or Sign up! Also save your own Default Preset!
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
              className="preset-button"
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