/* eslint-disable no-empty */
import Auth from "./AuthService";
import { setInitialHeaders, clearHeaders, setAuthHeader } from "./headersUtils";
import { API_URL } from "../constants";
import { IGif, ISaveUserPresetArgs } from "../types";

import { IDBPreset } from "../utils/PresetButtonsListClass";
import { localGifHelper } from "./IdbClass";

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
    constructor(isAlive: any) {
        this.isAlive = isAlive;
    }

    public alive(): any {
        return this.isAlive;
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

    public static async addNewPreset(
        args: ISaveUserPresetArgs,
        token: string
    ): Promise<IDBPreset[] | unknown> {
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

    public static async getGifs(): Promise<Array<IGif> | void> {
        headers = clearHeaders(headers);
        headers = setInitialHeaders(headers);
        try {
            const gifs = await localGifHelper.handleRequest("getAll");
            console.log("local gifs", gifs);

            const haveLocalGifs = Array.isArray(gifs) && gifs.length;

            if (haveLocalGifs) {
                return gifs;
            }

            // TODO: if requesting new set that is in the user's column of preferred gifs
            // delete all from the idb and store the new ones that are stored in the user's preferred gifs
            // await localGifHelper.handleRequest("deleteAll");

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
