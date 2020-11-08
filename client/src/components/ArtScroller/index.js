//REACT IMPORTS
import React from 'react';

//APOLLO GRAPHQL
import {useQuery, useMutation} from '@apollo/react-hooks';
//QUERIES
import {
  GET_SEARCH_TERMS
} from '../../utils/queries.js';

//MUTATIONS
import {
  UPDATE_USER_SEARCH_TERM
} from '../../utils/mutations.js';

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
  //GRAPHQL DATABASE QUERY FOR CATEGORY SELECTIONS



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
    searchTerms,
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
          <select 
            name="category"
          >
            {

            }
          </select>
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