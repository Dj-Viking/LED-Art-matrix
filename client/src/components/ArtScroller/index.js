//REACT IMPORTS
import React, {useEffect, useState} from 'react';

//REACT SPRING
import {useSpring, animated, config} from 'react-spring';

//STYLES
import './scrolling-styles/artScrollerLayoutStyle.css';

//AUTH
// import Auth from '../../utils/auth.js';

//HELPERS
import {
  getRandomIntLimit,
} from '../../utils/helpers.js';

//APOLLO GRAPHQL
import {useLazyQuery} from '@apollo/react-hooks';
//QUERIES
import {
  GET_GIFS_CREATE_AND_OR_UPDATE
} from '../../utils/queries.js';

//MUTATIONS
import {
  //UPDATE_USER_SEARCH_TERM
} from '../../utils/mutations.js';

//REDUX
import { useSelector, useDispatch } from 'react-redux';
//ACTIONS
import {
  getGifs,
} from '../../actions/art-scroller-actions';


const ArtScroller = () => {

  //init button spring
  const leftInitButtonSpring = useSpring({
    config: config.wobbly,
    delay: 100,
    from: {
      opacity: 0,
      marginRight: '1000px' 
    },
    to: {
      opacity: 1,
      marginRight: '5px'
    }
  });

  //scroller on/off button spring
  const scrollerOnOffButtonSpring = useSpring({
    config: config.wobbly,
    delay: 100,
    from :{
      opacity: 0
    },
    to: {
      opacity: 1
    }
  });

  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();

  const [getGifsQuery, { loading, data }] = useLazyQuery(GET_GIFS_CREATE_AND_OR_UPDATE);
  

  useEffect(() => {
    if (!loading) {
      if (!!data) {
        console.log("got gif data after done loading", data);
        dispatchREDUX(getGifs(data.getGifsCreateAndOrUpdate))
      }
    }
    return () => void 0;
  }, [loading, data, dispatchREDUX]);


  //OBSERVE GLOBAL STATE
  const artScrollerState = useSelector(state => state.artScroller);

  //GLOBAL PIECE OF STATE
  const {
    gifs,
  } = artScrollerState;



  async function handleGetGifs(event) {
    event.persist();
    if (figureIsOnState === false) setFigureIsOnState(true);
    try {
      getGifsQuery();
    } catch (error) {
      console.log("error when trying to get gifs", error);
    }
  }

  //create animation that scrolls opacity at different animation durations
  // for opacity only
  const [animationDurationState, setAnimationDurationState] = useState('30');
  function handleAnimationDurationChange(event) {
    setAnimationDurationState(event.target.value);
  }

  //position style state
  //input sliders for positioning the circle
  //maybe later can click and drag. and throw around
  const [verticalPositionState, setVerticalPositionState] = useState('50');
  function handleVerticalPositionStateChange(event) {
    setVerticalPositionState(event.target.value);
  }

  //horizontal position style state
  const [horizontalPositionState, setHorizontalPositionState] = useState('33.4');
  function handleHorizontalPositionStateChange(event) {
    setHorizontalPositionState(event.target.value);
  }

  //width of circle state maybe
  // input slider for widening the scroller
  const [scrollerCircleWidth, setScrollerCircleWidth] = useState('30')
  function handleScrollerCircleWidthChange(event) {
    setScrollerCircleWidth(event.target.value)
  }

  const [invertState, setInvertState] = useState(0);
  function handleInvertChange(event) {
    setInvertState(event.target.value)
  }

  const [figureIsOnState, setFigureIsOnState] = useState(false);
  function handleFigureChange(event) {
    figureIsOnState ? setFigureIsOnState(false) : setFigureIsOnState(true);
  }


  return (
    <>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <section>
          <div className="border-top-artScroller"></div>
          <span
            style={{
              color: 'white',
              textAlign: 'center'
            }}
          >
            Art Scroller Controls
          </span>
          <div
            className="preset-button-container"
          >

            <animated.button
              style={leftInitButtonSpring}
              className="scroller-fetch-button"
              onClick={handleGetGifs}
            >
              Start Art Scroller!
            </animated.button>
            <animated.button
              style={scrollerOnOffButtonSpring}
              className={figureIsOnState ? 'scroller-toggle-button-on' : 'scroller-toggle-button-off'}
              onClick={handleFigureChange}
            >
              {
                figureIsOnState
                ?
                <span style={{color: 'white'}}>Turn Off Scroller</span>
                :
                <span style={{color: 'white'}}>Turn On Scroller</span>
              }
            </animated.button>
          </div>
          <div
            className="slider-container"
          >
            <label
              htmlFor="scroller-circle-width"
              style={{color: 'white'}}
            >

              Scroller Circle Width: {scrollerCircleWidth}
            </label>
            <input 
              name="scroller-circle-width"
              className="slider-style"
              type="range"
              min="0"
              max="100"
              value={scrollerCircleWidth}
              onChange={handleScrollerCircleWidthChange}
            />
            <label
              htmlFor="vertical-positioning"
              style={{color: 'white'}}
            >

              Scroller Vert Positioning: {verticalPositionState}
            </label>
            <input 
              name="vertical-positioning"
              className="slider-style"
              type="range"
              min="0"
              max="200"
              value={verticalPositionState}
              onChange={handleVerticalPositionStateChange}
            />
            <label
              htmlFor="horizontal-positioning"
              style={{color: 'white'}}
            >

              Scroller Horizontal Positioning: {horizontalPositionState / 1000}
            </label>
            <input 
              name="horizontal-positioning"
              className="slider-style"
              type="range"
              min="0"
              max="100"
              value={horizontalPositionState}
              onChange={handleHorizontalPositionStateChange}
            />
            <label
              htmlFor="invert"
              style={{color: 'white'}}
            >
              Invert Colors: {invertState/100}
            </label>
            <input
              className="slider-style"
              name="invert"
              type="range"
              min="0"
              max="100"
              value={invertState}
              onChange={handleInvertChange}
            />
            <label
              htmlFor="animation-duration"
              style={{color: 'white'}}
            >
              Scroll Speed: {animationDurationState/100}
            </label>
            <input
              className="slider-style"
              name="animation-duration"
              type="range"
              min="1"
              max="100"
              value={animationDurationState}
              onChange={handleAnimationDurationChange}
            />
          </div>
          <figure
            style={{
              display: `${figureIsOnState ? 'block' : 'none'}`,
              margin: '0'
            }}
            className="figure-transition-style"
          >
            {
              Array.isArray(gifs)
              &&
              gifs.map((gif, index) => (
                <img 
                  key={gif._id}
                  alt={`gif-${index}`}
                  src={gif.gifSrc}
                  style={{
                    position: 'absolute',
                    zIndex: '1',
                    //opacity: `${opacityState/100}`,
                    filter: `invert(${invertState/100})`,
                    borderRadius: `50%`,
                    animationName: 'scrollAnim',
                    animationDuration: `${animationDurationState/100 * (index + getRandomIntLimit(index, 20))}s`,
                    animationDelay: `0.${index + 1}`,
                    animationTimingFunction: 'ease-in',
                    animationDirection: 'reverse',
                    animationIterationCount: 'infinite',
                    top: `${verticalPositionState}vh`,
                    width: `${scrollerCircleWidth}vw`,
                    left: `${horizontalPositionState}vw`
                  }}
                  className="scroller-media"
                />
              ))
            }
          </figure>
        </section>
      </main>
    </>
  );
};

export default ArtScroller;