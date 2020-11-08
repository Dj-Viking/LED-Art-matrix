export const isOn = (data) => {
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

export const searchTermchange = (data) => {
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