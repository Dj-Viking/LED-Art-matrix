import { createAsyncThunk } from "@reduxjs/toolkit";
import { ToolkitDispatch, ToolkitRootState } from "../store/store";
import { IGif } from "../types";
import { ApiService } from "../utils/ApiService";
import AuthService from "../utils/AuthService";
import { artScrollerActions } from "../store/artScrollerSlice";
import { modalActions } from "../store/modalSlice";

const moduleName = "artScrollerSlice";

export const buildGetGifsAction = createAsyncThunk<
    IGif[],
    void,
    { state: ToolkitRootState; dispatch: ToolkitDispatch }
>(moduleName + "/midiAccess", async (_params, _thunkAPI) => {
    let gifs: IGif[] = [];
    if (AuthService.loggedIn()) {
        const userGifs = (await ApiService.getGifs(
            AuthService.getToken() as string,
            true
        )) as IGif[];

        _thunkAPI.dispatch(artScrollerActions.setGifs(userGifs));
        _thunkAPI.dispatch(artScrollerActions.setListName(userGifs[0]?.listName || "test"));
        _thunkAPI.dispatch(
            modalActions.setGifModalContext({
                listName: userGifs[0].listName,
                gif: userGifs[0],
            })
        );
        gifs = userGifs;
    } else {
        const freeGifs = (await ApiService.getUnloggedInGifs(true)) as IGif[];

        _thunkAPI.dispatch(artScrollerActions.setGifs(freeGifs));
        _thunkAPI.dispatch(artScrollerActions.setListName(freeGifs[0]?.listName || "test"));
        _thunkAPI.dispatch(
            modalActions.setGifModalContext({
                listName: freeGifs[0].listName,
                gif: freeGifs[0],
            })
        );
        gifs = freeGifs;
    }
    return gifs;
});
