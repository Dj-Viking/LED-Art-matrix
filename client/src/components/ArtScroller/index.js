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
  idbPromise
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
    if (getGifsQueryResponse.data)
    {
      console.log(getGifsQueryResponse);
      dispatchREDUX(
        getGifs(
          getGifsQueryResponse.data.getGifsCreateAndOrUpdate
        )
      );

      //check the idb store for gifs if exists and delete it and put the new one in
      async function updateIDBGifs() {
        Promise.resolve(idbPromise('gifs', 'get'))
        .then(
          async (res) => {
            console.log('got the idb gifs');
            console.log(res);

            console.log('updating if only it does not exist yet on the browser idb store...');
            if (res[0] === undefined) {
              getGifsQueryResponse.data.getGifsCreateAndOrUpdate.forEach(gif => {
                console.log('updating idb gifs...');
                return idbPromise('gifs', 'put', gif);
              });
            } else {
              console.log('exists already deleting current store and making new one');
              //find current store and delete based on the object._id's 
              // that were passed into the delete function for each gif of the idb array
              Promise.resolve(idbPromise('gifs', 'get'))
              .then(
                async (res) => {
                  console.log('deleting current idb gifs...');
                  console.log(res);
                  res.forEach(gif => {
                    return idbPromise('gifs', 'delete', gif)
                  })
                }
              )
              .catch(err => console.log(err));
              
              //update current gifs
              getGifsQueryResponse.data.getGifsCreateAndOrUpdate.forEach(gif => {
                console.log('updating current gifs...');
                return idbPromise('gifs', 'put', gif);
              })
            }
          }
        )
        .catch(error => console.error(error));
      }
      console.log(Promise.resolve(updateIDBGifs()).then(res => console.log(res)));
    } 
    else if (!getGifsQueryResponse.data) 
    {
      //fetch to database failed for api call fetch from idb
      //and dispatch the gifs to the action to change the gifs array state
      Promise.resolve(idbPromise('gifs', 'get'))
      .then(
        async (res) => {
          //got gifs from idb that should exist if already were online to fetch some gifs.
          console.log(res);
          try {
            dispatchREDUX(
              getGifs(
                [...res]
              )
            )
          } catch (error) {
            console.log(error);
          }
        }
      )
      .catch(err => console.log(err));
    }
  }, [getGifsQueryResponse, dispatchREDUX, getGifsQueryResponse.data]);


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
    try {
      if (event.key === 'w') {
        getGifsQueryResponse.refetch();
      } else {
        console.log(event.target.parentElement);
        getGifsQueryResponse.refetch();
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (navigator in window && window.navigator.onLine === false) {
        console.log('navigator');
        console.log('refetch failed pulling from idb');
        Promise.resolve(idbPromise('gifs', 'get'))
        .then(
          (res) => {
            console.log('trying to get from idb since refetch failed');
    
            dispatchREDUX(
              getGifs(
                [...res]
              )
            );
          }
        )
        .catch(err => console.log(err));
      }
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

    // @media screen and (max-width: 1024px) {
  //   .scroller-media {
  //     top: 37vh;
  //     left: 33.4vw;
  //     height: 50vh;
  //     width: 30vw;
  //   }
  // }

  //width of circle state maybe
  // input slider for widening the scroller
  const [scrollerCircleWidth, setScrollerCircleWidth] = useState('30')
  function handleScrollerCircleWidthChange(event) {
    setScrollerCircleWidth(event.target.value)
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