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
  getRandomIntLimit
} from '../../utils/helpers.js';

//APOLLO GRAPHQL
import {useQuery} from '@apollo/react-hooks';
//QUERIES
import {
  //GET_SEARCH_TERMS,
  //USER_QUERY,
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
  //verifyOn,
  getGifs,
  //scrollGifInterval,
  //searchTermChange,
  //searchValidate
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
  //console.log(dispatchREDUX);
  //GRAPHQL DATABASE QUERY FOR CATEGORY SELECTIONS
  //GET USER INFO
  //const userQueryResponse = useQuery(USER_QUERY);
  //GET SEARCH TERM INFO
  //const searchTermQueryResponse = useQuery(GET_SEARCH_TERMS);
  //GET GIFS 
  const getGifsQueryResponse = useQuery(GET_GIFS_CREATE_AND_OR_UPDATE);
  // console.log(getGifsQueryResponse.data);

  //lazy event triggered server get gifs query
  //const [lazyGetGifs, {loading, data}] = useLazyQuery(GET_GIFS_CREATE_AND_OR_UPDATE);
  
  //update the state of the searchTerms out of artScrollerState
  useEffect(() => {
    if (
      getGifsQueryResponse.data
    )
    {
      //console.log(getGifsQueryResponse);
      dispatchREDUX(
        getGifs(
          getGifsQueryResponse.data.getGifsCreateAndOrUpdate
        )
      );
    }
  }, [getGifsQueryResponse, dispatchREDUX]);


  //OBSERVE GLOBAL STATE
  const artScrollerState = useSelector(state => state.artScroller);
  //console.log(artScrollerState);

  //GLOBAL PIECE OF STATE
  const {
    //isOnState,
    gifs,
    //scrollInterval,
    //searchTerms,
    //searchIsValid
  } = artScrollerState;
  //console.log("search terms state");
  //console.log(searchTerms);

  async function handleRefetch(event) {
    event.persist();
    console.log(event.key);
    if (figureIsOnState === false) {
      setFigureIsOnState(true);
    }
    if (event.key === 'w') {
      getGifsQueryResponse.refetch();
    } else {
      console.log(event.target.parentElement);
      getGifsQueryResponse.refetch();
    }
  }

  //create animation that scrolls opacity at different animation durations
  // for opacity only
  const [animationDurationState, setAnimationDurationState] = useState(30);
  function handleAnimationDurationChange(event) {
    setAnimationDurationState(event.target.value);
  }

  //animation delays

  //handle all gifs opacity local state
  //const [opacityState, setOpacityState] = useState(0);
  // function handleOpacityChange(event) {
  //   setOpacityState(event.target.value)
  // }

  const [invertState, setInvertState] = useState(0);
  function handleInvertChange(event) {
    setInvertState(event.target.value)
  }

  const [figureIsOnState, setFigureIsOnState] = useState(false);
  function handleFigureChange(event) {
    setFigureIsOnState(!figureIsOnState);
  }

  // .img-scroll {
  //   animation-name: scrollAnim;
  //   animation-duration: .5s;
  //   animation-delay: .1s; //lowest to highest duration for each gif
  //   animation-timing-function: ease-in;
  //   animation-direction: alternate;
  //   animation-iteration-count: infinite;
  // }

  return (
    <>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* <div
          style={{
            color: 'white',
            marginTop: '10px'
          }}
        >
          Art Scroller
        </div> */}
        <section>
          {/* <form>
            <select
              name="category"
            >
              {
                searchTerms.map(searchTerm => (
                <option 
                  name="category"
                  key={searchTerm._id}
                > 
                  {searchTerm.termText}
                </option>
                ))
              }
            </select>
          </form> */}
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
              onClick={handleRefetch}
              onKeyPress={handleRefetch}
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
          {/* <label 
            htmlFor="opacity"
            style={{color: 'white'}}
          >
            opacity: {opacityState/100}
          </label>
          <input 
            name="opacity"
            type="range"
            min="0"
            max="30"
            value={opacityState}
            onChange={handleOpacityChange}
          /> */}
          <div
            className="slider-container"
          >
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
              gifs 
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
                    animationIterationCount: 'infinite'
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