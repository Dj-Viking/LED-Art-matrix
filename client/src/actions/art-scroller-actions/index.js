export const isOn = (data) => {
  //some condition preventing to be on...
  //false by default
  //ACTIVATE ON THE RETURN OF API QUERY DATA
  
  return {
    type: 'VERIFY_IS_ON',
    payload: data
  };
};

export const getGifs = (data) => {
  return {
    type: 'GET_GIFS',
    payload: data
  };
};

export const scrollGifInterval = (data) => {
  return {
    type: 'SCROLL_GIF_INTERVAL',
    payload: data
  };
};

export const searchTermChange = (data) => {
  return {
    type: 'SEARCH_TERM_CHANGE',
    payload: data
  }
}
export const searchValidate = (data) => {
  return {
    type: 'SEARCH_VALIDATE',
    payload: data
  };
};