// some condition preventing to be on...
// false by default

import { IGetGifsAction, IGif } from "../types";

// ACTIVATE ON THE RETURN OF API QUERY DATA
export const getGifs = (data: Array<IGif>): IGetGifsAction => ({
  type: 'GET_GIFS',
  payload: data
});
