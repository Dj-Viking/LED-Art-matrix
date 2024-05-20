/* eslint-disable no-empty */
import Auth from "./AuthService";
import { setInitialHeaders, clearHeaders, setAuthHeader } from "./headersUtils";
import { API_URL, IS_PROD } from "../constants";
import { IGif, ISaveUserPresetArgs } from "../types";

import { IDBPreset } from "../utils/PresetButtonsListClass";
import { localGifHelper } from "./IdbClass";
import { base64ToBlob_Client } from "./base64StringToBlob";
const uuid = require("uuid");

let headers = {};
interface ISignupArgs {
    username: string;
    email: string;
    password: string;
}
interface ILoginArgs {
    usernameOrEmail: string;
    password: string;
}

export interface IApiService {
    alive: () => any;
    signup: (args: ISignupArgs) => Promise<boolean | void>;
    login: (args: ILoginArgs) => Promise<boolean | void>;
    getDefaultPreset: (token: string) => Promise<string | boolean>;
    updateDefaultPreset: (token: string) => Promise<string | void>;
    deletePreset: (_id: string, token: string) => Promise<IDBPreset[] | void>;
    addNewPreset: (args: ISaveUserPresetArgs) => Promise<IDBPreset[] | unknown>;
    getUserPresets: (token: string) => Promise<IDBPreset[] | void>;
    getGifs: () => Promise<Array<IGif>>;
    forgotPassword: (email: string) => Promise<boolean | void>;
    changePassword: (password: string) => Promise<{ done: boolean; token: string } | void>;
    createAllDefaultPresets: (token: string) => Promise<IDBPreset[] | void>;
}

class ApiService implements IApiService {
    protected isAlive: any;
    public signup!: (args: ISignupArgs) => Promise<boolean | void>;
    public login!: (args: ILoginArgs) => Promise<boolean | void>;
    public getDefaultPreset!: (token: string) => Promise<string | boolean>;
    public updateDefaultPreset!: (token: string) => Promise<string | void>;
    public deletePreset!: (_id: string, token: string) => Promise<IDBPreset[] | void>;
    public addNewPreset!: (args: ISaveUserPresetArgs) => Promise<IDBPreset[] | unknown>;
    public getUserPresets!: (token: string) => Promise<IDBPreset[] | void>;
    public getGifs!: () => Promise<Array<IGif>>;
    public forgotPassword!: (email: string) => Promise<boolean | void>;
    public changePassword!: (password: string) => Promise<{ done: boolean; token: string } | void>;
    public createAllDefaultPresets!: (token: string) => Promise<IDBPreset[] | void>;

    constructor(isAlive: any) {
        this.isAlive = isAlive;
    }

    public alive(): any {
        return this.isAlive;
    }

    private static handleError(endpoint: string, error: Error): void {
        if (!IS_PROD) {
            console.error(`an error occurred with endpoint ${endpoint}` + error.message + `\n ${error.stack}`);
            throw error;
        } else {
            console.error("an error occurred with " + endpoint);
            throw error;
        }
    }

    public static async signup(args: ISignupArgs): Promise<boolean | void> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        const { username, password, email } = args;
        try {
            const res = await fetch(`${API_URL}/user`, {
                method: "POST",
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
                headers,
            });
            const data = await res.json();
            if (!data.token) {
                throw new Error("can't login without a token");
            }
            Auth.login(data.token);
            return true;
        } catch (error) {
            const err = error as Error;
            throw new Error(err.message);
        }
    }

    public static async login(args: ILoginArgs): Promise<boolean | Error> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        const { usernameOrEmail, password } = args;
        try {
            const res = await fetch(`${API_URL}/user/login`, {
                method: "POST",
                body: JSON.stringify({
                    usernameOrEmail: {
                        email: /@/g.test(usernameOrEmail) ? usernameOrEmail : void 0,
                        username: !/@/g.test(usernameOrEmail) ? usernameOrEmail : void 0,
                    },
                    password,
                }),
                headers,
            });
            if (res.status === 400) {
                throw new Error("Invalid credentials");
            }
            const data = await res.json();
            if (!data.user.token) {
                throw new Error("can't login without a token");
            }
            Auth.login(data.user.token);
            return true;
        } catch (error) {
            const err = error as Error;
            throw new Error(err.message);
        }
    }

    public static async getDefaultPreset(token: string): Promise<IDBPreset | void> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        headers = setAuthHeader(headers, token);
        try {
            const res = await fetch(`${API_URL}/user`, {
                method: "GET",
                headers,
            });
            const data = await res.json();
            return data.preset;
        } catch (error) {}
    }

    public static async getUserPresets(token: string): Promise<IDBPreset[] | void> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        headers = setAuthHeader(headers, token);
        try {
            const res = await fetch(`${API_URL}/user/presets`, {
                method: "GET",
                headers,
            });
            if (res.status === 403) {
                //silently fail and logout user if 403 possible expired token or invalid token,
                Auth.logout();
            }
            const data = await res.json();
            return data.presets;
        } catch (error) {}
    }

    public static async deletePreset(_id: string, token: string): Promise<IDBPreset[] | void> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        headers = setAuthHeader(headers, token);
        const res = await fetch(`${API_URL}/user/delete-preset`, {
            method: "DELETE",
            body: JSON.stringify({ _id }),
            headers,
        });
        if (res.status !== 200) {
            throw new Error("Error during the deleting of a preset!");
        }
    }

    public static async createAllDefaultPresets(token: string): Promise<IDBPreset[] | void> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        headers = setAuthHeader(headers, token);
        try {
            const res = await fetch(`${API_URL}/user/createAllDefaultPresets`, {
                method: "POST",
                headers,
            });
            if (res.status !== 200) {
                throw new Error(" There was a problem creating all the default presets");
            }
            const data = await res.json();
            return data.presets;
        } catch (error) {
            const err = error as Error;
            throw new Error(err.message);
        }
    }

    public static async addNewPreset(args: ISaveUserPresetArgs, token: string): Promise<IDBPreset[] | unknown> {
        const { presetName, animVarCoeff, displayName } = args;
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        headers = setAuthHeader(headers, token);
        try {
            const res = await fetch(`${API_URL}/user/add-preset`, {
                method: "POST",
                body: JSON.stringify({ presetName, animVarCoeff, displayName }),
                headers,
            });
            if (res.status !== 200) {
                throw new Error("There was a problem with adding a Preset!");
            }
            const data = await res.json();
            return data.presets;
        } catch (error) {
            const err = error as Error;
            throw err.message;
        }
    }

    public static async updateDefaultPreset(args: {
        name: string;
        animVarCoeff: string;
        _id: string;
        token: string;
        displayName: string;
    }): Promise<void | Error> {
        try {
            const { name, animVarCoeff, token, _id, displayName } = args;
            headers = clearHeaders(headers);
            headers = setInitialHeaders(headers);
            headers = setAuthHeader(headers, token);
            const res = await fetch(`${API_URL}/user/update-preset`, {
                method: "PUT",
                body: JSON.stringify({ defaultPreset: name, animVarCoeff, _id, displayName }),
                headers,
            });
            if (!res.ok) throw new Error("Update could not happen at this time.");
        } catch (error) {
            return error as Error;
        }
    }

    public static async getUnloggedInGifs(getNew = false): Promise<IGif[] | void> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        try {
            let gifs: IGif[] = [];

            if (!getNew) {
                gifs = (await localGifHelper.handleRequest("getAll")) as IGif[];
                if (gifs.length > 0) {
                    return gifs;
                }
            } else {
                await localGifHelper.handleRequest("deleteAll");
            }

            const res = await fetch(`${API_URL}/gifs/unloggedGet`, {
                method: "GET",
                headers,
            });

            // always has a length of 1 coming from db if request was made by unlogged-in user
            const data = (await res.json()) as { gifs: IGif[] };

            // put that instance in the store
            await localGifHelper.handleRequest("put", data.gifs[0]);

            gifs = data.gifs;

            return gifs;
        } catch (error) {
            const err = error as Error;
            ApiService.handleError("getUnloggedInGifs", err);
        }
    }

    public static async saveGifsAsStrings(token: string, gif: IGif, listName: string): Promise<IGif[]> {
        headers = clearHeaders(headers);
        headers = setAuthHeader(headers, token);

        try {
            // TODO: figure out how to send gifs that are huge
            // mongo has query size limit to ~17MB
            const gifBlobs = gif.gifSrcs.map((fileStr: string) => {
                const newStr = fileStr.split(";base64, ")[1];
                const result = base64ToBlob_Client(newStr, "image/webp");
                return result;
            });

            const reqId = uuid.v4();

            const promises = gifBlobs.map((blob: Blob, i: number, array: Blob[]) => {
                const formData = new FormData();
                formData.append("listName", listName);
                formData.append("reqId", reqId);
                formData.append("gifCount", array.length.toString());
                formData.append("imageName", "gifImage_" + i);
                formData.append("gifImage_" + i, blob);
                return fetch(`${API_URL}/gifs/saveGifsAsStrings`, {
                    method: "POST",
                    body: formData,
                    headers,
                });
            });

            const results = await Promise.all(promises);

            const jsonPromises = results.map((res) => {
                return res.json();
            });

            const jsons = (await Promise.all(jsonPromises)) as IGif[][];

            console.log("DATA FROM SAVING", jsons);

            const data = jsons.find((json) => json?.length > 0);

            // TODO: redo the actions which update the state such as
            // closing the modal and updating the modal context
            // and the selected listName as the gif list that was
            // just saved in the db
            // @ts-ignore
            return data;
        } catch (error) {
            const err = error as Error;
            ApiService.handleError("saveGifsAsStrings", err);
            return [];
        }
    }

    public static async createGifs(token: string, gif: IGif, listName: string): Promise<IGif[] | void> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        headers = setAuthHeader(headers, token);
        try {
            const res = await fetch(`${API_URL}/gifs/createNewCollection`, {
                method: "POST",
                body: JSON.stringify({ gif, listName }),
                headers,
            });
            const data = (await res.json()) as { gifs: IGif[] };
            return data.gifs;
        } catch (error) {
            const err = error as Error;
            ApiService.handleError("createGifs", err);
        }
    }

    public static async getGifsAsStrs(): Promise<Array<IGif> | void> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);

        try {
            const gifs = await fetch(API_URL + "/gifs/getGifsAsDataStrings");
            const data = await gifs.json();

            return data.gifs;
        } catch (error) {
            const err = error as Error;
            ApiService.handleError("getGifsAsStrs", err);
        }
    }

    public static async getGifs(token: string, getNew: boolean): Promise<Array<IGif> | void> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        headers = setAuthHeader(headers, token);
        try {
            const gifs = await localGifHelper.handleRequest("getAll");

            let haveLocalGifs: boolean = Array.isArray(gifs) && gifs.length >= 0;

            if (haveLocalGifs && !getNew) {
                haveLocalGifs = false;
                return gifs;
            }

            // TODO: if requesting new set that is in the user's column of preferred gifs
            // delete all from the idb and store the new ones that are stored in the user's preferred gifs
            if (getNew) {
                await localGifHelper.handleRequest("deleteAll");
            }

            const res = await fetch(`${API_URL}/gifs/get`, {
                method: "GET",
                headers,
            });

            const data = (await res.json()) as { gifs: IGif[] };

            if (!haveLocalGifs) {
                const promises = data.gifs.map((gif) => localGifHelper.handleRequest("put", gif));
                await Promise.all(promises);
            }

            return data.gifs;
        } catch (error) {}
    }

    public static async forgotPassword(email: string): Promise<boolean | void> {
        try {
            headers = clearHeaders(headers);
            headers = setInitialHeaders(headers);
            const res = await fetch(`${API_URL}/user/forgot`, {
                method: "POST",
                body: JSON.stringify({ email }),
                headers,
            });
            if (res.status === 500) {
                throw new Error("error");
            }
            const data = await res.json();
            if (data.message) return true;
        } catch (error) {
            throw new Error("error");
        }
    }

    public static async changePassword(args: {
        password: string;
        token: string;
    }): Promise<{ done: boolean; token: string } | void> {
        try {
            headers = clearHeaders(headers);
            headers = setInitialHeaders(headers);
            const { password, token } = args;
            const res = await fetch(`${API_URL}/user/change-pass`, {
                method: "PUT",
                body: JSON.stringify({ password, token }),
                headers,
            });
            if (res.status !== 200) {
                throw new Error("Couldn't change password at this time");
            }
            const data = await res.json();
            return data;
        } catch (error) {
            return void 0;
        }
    }
}

export default ApiService;
export { ApiService };
