const artScrollerReducer = (
  state = {
    isOnState: false,
    gifs: [],
    scrollInterval: 1000,
    searchTerms: [],
    searchIsValid: false
  },
  action
) => {
  switch(action.type) {
    case 'VERIFY_IS_ON':
      return {
        ...state,
       isOn: action.payload
      }
    case 'GET_GIFS':
      return {
        ...state,
        gifs: action.payload
      }
    case 'SCROLL_INTERVAL_CHANGE':
      return {
        ...state,
        scrollInterval: action.payload
      }
    case 'SEARCH_TERM_CHANGE':
      return {
        ...state,
        searchTerms: action.payload
      }
    case 'SEARCH_VALIDATE': 
      return {
        ...state,
        searchIsValid: action.payload
      }
    default: return state
  }
};

export default artScrollerReducer;