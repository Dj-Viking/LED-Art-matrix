import { createAsyncThunk } from "@reduxjs/toolkit";
import { MyThunkConfig, IGif } from "../../types";
import { ApiService } from "../../utils/ApiService";
import AuthService from "../../utils/AuthService";
import { modalActions } from "../modalSlice";

const moduleName = "artScrollerSlice";

export interface SaveGifsResult {
    gifs: IGif[];
    newListName: string;
}
export type GetGifsResult = SaveGifsResult;

export const buildCreateGifsAction = createAsyncThunk<
    { gifs: IGif[]; newListName: string },
    { gif: IGif; listName: string },
    MyThunkConfig
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
    MyThunkConfig
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
        const freeGifs = (await ApiService.getUnloggedInGifs(false)) as IGif[];

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
            // hacky way to prevent dupes...
            // if we got the gifs from indexed db - I know that I'm pushing the same list from indexed db back into state..TODO: Fix me
            const gifSet = new Set<IGif>([
                ..._thunkAPI.getState().artScrollerState.gifs,
                ...freeGifs,
            ]);

            gifs = Array.from(gifSet);
        } else {
            gifs = freeGifs;
        }
    }

    return {
        gifs,
        newListName,
    };
});
