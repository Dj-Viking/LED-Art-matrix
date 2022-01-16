import auth from "./auth";
import { setInitialHeaders, clearHeaders, setAuthHeader } from "./headersUtils";
import { API_URL } from "../constants";
import { IGif } from "../types";

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
  getGifs: () => Promise<Array<IGif>>;
  forgotPassword: (email: string) => Promise<boolean | void>;
  changePassword: (password: string) => Promise<{done: boolean, token: string } | void>;
}

class ApiService implements IApiService {
  protected isAlive: any;
  public signup!: (args: ISignupArgs) => Promise<boolean | void>;
  public login!: (args: ILoginArgs) => Promise<boolean | void>;
  public getDefaultPreset!: (token: string) => Promise<string | boolean>;
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
      console.log("data now", (await res.json()));
      const data = await res.json();
      console.log("data test", data);
      if (!data.token) {
        throw new Error("can't login without a token");
      }
      auth.login(data.token);
      return true;
    } catch (error) {
      console.error("error when signing up in service", error);
      const err = error as Error;
      throw new Error(err.message);
    }
  }

  public static async login(args: ILoginArgs): Promise<boolean | void> {
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
      auth.login(data.user.token);
      return true;
    } catch (error) {
      console.error("error when logging in", error);
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
      console.error("error when getting default preset", error);
      return false;
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
      if (res.ok) return void 0;
      return void 0;
    } catch (error) {
      console.error("error when updating default preset", error);
      return error as Error;
    }
  }

  public static async getGifs(): Promise<Array<string> | void> {
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
      console.error("error when trying to get gifs", error);
      return void 0;
    }
  }

  public static async forgotPassword(email: string): Promise<boolean | void> {
    try {
      headers = clearHeaders(headers);
      headers = setInitialHeaders(headers);
      await fetch(`${API_URL}/user/forgot`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers
      });
    } catch (error) {
      console.error("error when submitting forgot password request", error);
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
      console.error("error when changing password", error);
      return void 0;
    }
  }
}

export default ApiService;
export { ApiService };
