//REACT IMPORTS
import React, {useEffect} from 'react';

//APOLLO GRAPHQL
import {useQuery, useMutation} from '@apollo/react-hooks';
//QUERIES
import {
  GET_SEARCH_TERMS,
  USER_QUERY
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
  //REDUX DISPATCH
  const dispatchREDUX = useDispatch();
  //console.log(dispatchREDUX);
  //GRAPHQL DATABASE QUERY FOR CATEGORY SELECTIONS
  //GET USER INFO
  const userQueryResponse = useQuery(USER_QUERY);
  //GET SEARCH TERM INFO
  const searchTermQueryResponse = useQuery(GET_SEARCH_TERMS);
  
  //update the state of the searchTerms out of artScrollerState
  useEffect(() => {
    if (
      userQueryResponse.data 
      && 
      searchTermQueryResponse.data
    ){
      console.log(searchTermQueryResponse);
      //set the state of the searchterms to the data coming back from graphql
      dispatchREDUX(
        searchTermChange(
          searchTermQueryResponse.data.getSearchTerms
        )
      )
      console.log('got data');
    }
  }, [userQueryResponse, searchTermQueryResponse, dispatchREDUX])


  //OBSERVE GLOBAL STATE
  const artScrollerState = useSelector(state => state.artScroller);
  console.log(artScrollerState);

  //GLOBAL PIECE OF STATE
  const {
    isOn,
    gifs,
    scrollInterval,
    searchTerms,
    searchIsValid
  } = artScrollerState;
  console.log("search terms state");
  console.log(searchTerms);

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