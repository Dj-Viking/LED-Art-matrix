//REACT IMPORTS
import React from 'react';

//APOLLO GRAPHQL

//REDUX
import { useSelector, useDispatch } from 'react-redux';
//ACTIONS
import {
  isOn,
  getGifs,
  scrollGifInterval,
  searchTermChange,
  searchValidate
} from '../../actions/art-scroller-actions';


const ArtScroller = () => {
  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();
  console.log(dispatchREDUX);
  //OBSERVE GLOBAL STATE
  const artScrollerState = useSelector(state => state.artScroller);
  console.log(artScrollerState);
  const {
    isOn,
    gifs,
    scrollInterval,
    searchTerm,
    searchIsValid
  } = artScrollerState;
  return (
    <>
      <div
        style={{color: 'white'}}
      >
        art scroller
      </div>
      <section>
        <form>
          <input 
            type="text"
            value={searchTerm}
          />
          <button
            type="submit"
          >
            search!
          </button>
        </form>
      </section>
    </>
  );
};

export default ArtScroller;