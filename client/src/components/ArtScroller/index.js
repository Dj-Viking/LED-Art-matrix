//REACT IMPORTS
import React, {useEffect, useState} from 'react';

//STYLES
import './scrolling-styles/style.css';

//HELPERS
import {
  getRandomIntLimit
} from '../../utils/helpers.js';

//APOLLO GRAPHQL
import {useQuery, useMutation, useLazyQuery} from '@apollo/react-hooks';
//QUERIES
import {
  GET_SEARCH_TERMS,
  USER_QUERY,
  GET_GIFS_CREATE_AND_OR_UPDATE
} from '../../utils/queries.js';

//MUTATIONS
import {
  UPDATE_USER_SEARCH_TERM
} from '../../utils/mutations.js';

//REDUX
import { useSelector, useDispatch } from 'react-redux';
//ACTIONS
import {
  verifyOn,
  getGifs,
  scrollGifInterval,
  searchTermChange,
  searchValidate
} from '../../actions/art-scroller-actions';


const ArtScroller = () => {

  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();
  //console.log(dispatchREDUX);
  //GRAPHQL DATABASE QUERY FOR CATEGORY SELECTIONS
  //GET USER INFO
  const userQueryResponse = useQuery(USER_QUERY);
  //GET SEARCH TERM INFO
  const searchTermQueryResponse = useQuery(GET_SEARCH_TERMS);
  //GET GIFS 
  const getGifsQueryResponse = useQuery(GET_GIFS_CREATE_AND_OR_UPDATE);
  // console.log(getGifsQueryResponse.data);

  //lazy event triggered server get gifs query
  const [lazyGetGifs, {loading, data}] = useLazyQuery(GET_GIFS_CREATE_AND_OR_UPDATE);
  
  //update the state of the searchTerms out of artScrollerState
  useEffect(() => {
    if (
      getGifsQueryResponse.data
    )
    {
      console.log(getGifsQueryResponse);
      dispatchREDUX(
        getGifs(
          getGifsQueryResponse.data.getGifsCreateAndOrUpdate
        )
      );
    }
  }, [getGifsQueryResponse, dispatchREDUX]);


  //OBSERVE GLOBAL STATE
  const artScrollerState = useSelector(state => state.artScroller);
  console.log(artScrollerState);

  //GLOBAL PIECE OF STATE
  const {
    isOnState,
    gifs,
    scrollInterval,
    searchTerms,
    searchIsValid
  } = artScrollerState;
  console.log("search terms state");
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
  const [opacityState, setOpacityState] = useState(0);
  // function handleOpacityChange(event) {
  //   setOpacityState(event.target.value)
  // }

  const [borderRadiusState, setBorderRadiusState] = useState('50');
  // function handleBorderRadiuschange(event) {
  //   setBorderRadiusState(`${event.target.value}`);
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
      <div
        style={{
          color: 'white',
          marginTop: '10px'
        }}
      >
        Art Scroller
      </div>
      <section>
        <form>
          {/* <select
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
          </select> */}
        </form>
          <button
            onClick={handleRefetch}
            onKeyPress={handleRefetch}
          >
            Init Art Scroller!
          </button>
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
          {/* <label
            for="border-radius"
            style={{color: 'white'}}
          >
            border-radius: {borderRadiusState}
          </label>
          <input
            name="border-radius"
            type="range"
            min="0"
            max="50"
            value={borderRadiusState}
            onChange={handleBorderRadiuschange}
          /> */}
          <label
            htmlFor="invert"
            style={{color: 'white'}}
          >
            invert: {invertState/100}
          </label>
          <input
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
            gif scroll speed: {animationDurationState/100}
          </label>
          <input
            name="animation-duration"
            type="range"
            min="1"
            max="100"
            value={animationDurationState}
            onChange={handleAnimationDurationChange}
          />
          <button
            onClick={handleFigureChange}
          >
            {
              figureIsOnState
              ?
              <span>Turn Off Scroller</span>
              :
              <span>Turn On Scroller</span>
            }
          </button>
        <figure
          style={{
            display: `${figureIsOnState ? 'block' : 'none'}`
          }}
        >
          {
            gifs 
            &&
            gifs.map((gif, index) => (
              <img 
                key={gif._id}
                src={gif.gifSrc}
                style={{
                  position: 'absolute',
                  zIndex: '1',
                  top: '28.6vh',
                  left: '33.4vw',
                  opacity: `${opacityState/100}`,
                  filter: `invert(${invertState/100})`,
                  height: '50vh',
                  width: '30vw',
                  borderRadius: `${borderRadiusState}%`,
                  animationName: 'scrollAnim',
                  animationDuration: `${animationDurationState/100 * (index + getRandomIntLimit(index, 20))}s`,
                  animationDelay: `0.${index + 1}`,
                  animationTimingFunction: 'ease-in',
                  animationDirection: 'reverse',
                  animationIterationCount: 'infinite'
                }}
              />
            ))
          }
        </figure>
      </section>
    </>
  );
};

export default ArtScroller;