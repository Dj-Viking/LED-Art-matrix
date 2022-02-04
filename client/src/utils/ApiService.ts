import { AuthService as Auth } from "./AuthService";
import { setInitialHeaders, clearHeaders, setAuthHeader } from "./headersUtils";
import { API_URL } from "../constants";
import { IGif } from "../types";

import { IDBPreset } from "../utils/PresetButtonsListClass";

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
  alive: () => void;
  signup: (args: ISignupArgs) => Promise<boolean | void>;
  login: (args: ILoginArgs) => Promise<boolean | void>;
  getDefaultPreset: (token: string) => Promise<string | boolean>;
  updateDefaultPreset: (token: string) => Promise<string | void>;
  getUserPresets: (token: string) => Promise<IDBPreset[] | void>;
  getGifs: () => Promise<Array<IGif>>;
  forgotPassword: (email: string) => Promise<boolean | void>;
  changePassword: (password: string) => Promise<{done: boolean, token: string } | void>;
}

class ApiService implements IApiService {
  protected isAlive: any;
  public signup!: (args: ISignupArgs) => Promise<boolean | void>;
  public login!: (args: ILoginArgs) => Promise<boolean | void>;
  public getDefaultPreset!: (token: string) => Promise<string | boolean>;
  public getUserPresets!: (token: string) => Promise<IDBPreset[] | void>;
  public updateDefaultPreset!: (token: string) => Promise<string | void>;
  public getGifs!: () => Promise<IGif[]>;
  public forgotPassword!: (email: string) => Promise<boolean | void>;
  public changePassword!: (password: string) => Promise<void | { done: boolean; token: string; }>;
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
          password
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

  public static async getDefaultPreset(token: string): Promise<string | boolean> {
    headers = clearHeaders(headers);
    headers = setInitialHeaders(headers);
    headers = setAuthHeader(headers, token);
    try {
      const res = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (data.error) throw new Error(`${data.error}`);
      return data.preset;
    } catch (error) {
      return false;
    }
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
      const data = await res.json();
      if (data.error) throw new Error("could not fetch preset's at this time");
      return data.presets;
    } catch (error) {
      console.error(error);
      const err = error as Error;
      throw new Error(err.message);
    }
  }

  public static async updateDefaultPreset(
    args: { name: string, token: string }
  ): Promise<void | Error> {
    try {
      const { name, token } = args;
      headers = clearHeaders(headers);
      headers = setInitialHeaders(headers);
      headers = setAuthHeader(headers, token);
      const res = await fetch(`${API_URL}/user/update-preset`, {
        method: "PUT",
        body: JSON.stringify({ defaultPreset: name }),
        headers,
      });
      if (!res.ok) throw new Error("Update could not happen at this time.");
      return void 0;
    } catch (error) {
      return error as Error;
    }
  }

  public static async getGifs(): Promise<Array<IGif> | void> {
    headers = clearHeaders(headers);
    headers = setInitialHeaders(headers);
    try {
      const res = await fetch(`${API_URL}/gifs/get`, {
        method: "GET",
        headers,
      });
      const data = await res.json();
      return data.gifs;
    } catch (error) {
      return void 0;
    }
  }

  public static async forgotPassword(email: string): Promise<boolean | void> {
    try {
      headers = clearHeaders(headers);
      headers = setInitialHeaders(headers);
      const res = await fetch(`${API_URL}/user/forgot`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers
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

  public static async changePassword(
    args: { password: string, token: string }
  ): Promise<{done: boolean, token: string } | void> {
    try {
      headers = clearHeaders(headers);
      headers = setInitialHeaders(headers);
      const { password, token } = args;
      const res = await fetch(`${API_URL}/user/change-pass`, {
        method: "PUT",
        body: JSON.stringify({ password, token }),
        headers,
      });
      if (res.status !== 200) { throw new Error("Couldn't change password at this time"); }
      const data = await res.json();
      return data;
    } catch (error) {
      return void 0;
    }
  }
}

export default ApiService;
export { ApiService };
