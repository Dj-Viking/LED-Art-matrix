import { createAsyncThunk } from "@reduxjs/toolkit";
import { ToolkitDispatch, ToolkitRootState } from "../store/store";
import { IGif } from "../types";
import { ApiService } from "../utils/ApiService";
import AuthService from "../utils/AuthService";
import { modalActions } from "../store/modalSlice";

const moduleName = "artScrollerSlice";

export interface SaveGifsResult {
    gifs: IGif[];
    newListName: string;
}
export type GetGifsResult = SaveGifsResult;

export const buildCreateGifsAction = createAsyncThunk<
    { gifs: IGif[]; newListName: string },
    { gif: IGif; listName: string },
    { state: ToolkitRootState; dispatch: ToolkitDispatch }
>(moduleName + "/createGifs", async (params, _thunkAPI) => {
    const gifs = (await ApiService.createGifs(
        AuthService.getToken() as string,
        params.gif,
        params.listName
    )) as IGif[];

    _thunkAPI.dispatch(modalActions.setGifModalIsOpen(false));
    _thunkAPI.dispatch(
        modalActions.setGifModalContext({ listName: params.listName, gif: {} as any })
    );

    return {
        gifs,
        newListName: params.listName,
    };
});

export const buildGetGifsAction = createAsyncThunk<
    GetGifsResult,
    { getNew: boolean },
    { state: ToolkitRootState; dispatch: ToolkitDispatch }
>(moduleName + "/getGifs", async (params, _thunkAPI) => {
    let gifs: IGif[] = [];

    let newListName = "";

    if (AuthService.loggedIn() && !params.getNew) {
        const userGifs = (await ApiService.getGifs(
            AuthService.getToken() as string,
            true
        )) as IGif[];

        newListName = userGifs[userGifs.length - 1].listName;

        _thunkAPI.dispatch(
            modalActions.setGifModalContext({
                listName: userGifs[0].listName,
                gif: userGifs[0],
            })
        );

        gifs = userGifs;
    } else {
        const freeGifs = (await ApiService.getUnloggedInGifs(true)) as IGif[];

        newListName =
            freeGifs[0].listName +
            " " +
            _thunkAPI.getState().artScrollerState.gifs.length.toString();

        freeGifs[0].listName = newListName;

        _thunkAPI.dispatch(
            modalActions.setGifModalContext({
                listName: newListName,
                gif: freeGifs[0],
            })
        );

        if (_thunkAPI.getState().artScrollerState.gifs.length > 0) {
            gifs = [..._thunkAPI.getState().artScrollerState.gifs, ...freeGifs];
        } else {
            gifs = freeGifs;
        }
    }

    return {
        gifs,
        newListName,
    };
});
