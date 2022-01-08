import auth from "./auth";
import { setInitialHeaders, clearHeaders, setAuthHeader } from "./headersUtils";
import { API_URL } from "../constants";

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

class ApiService {
  public async signup(args: ISignupArgs): Promise<boolean | Error> {
    headers = clearHeaders(headers);
    headers = setInitialHeaders(headers);
    const { username, password, email } = args;
    try {
      const res = await fetch(`${API_URL}/user`, {
        method: 'POST',
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
      auth.login(data.token);
      return true;
    } catch (error) {
      console.error("error when signing up", error);
      return error as Error;
    }
  }

  public async login(args: ILoginArgs): Promise<boolean | Error> {
    headers = clearHeaders(headers);
    headers = setInitialHeaders(headers);
    const { usernameOrEmail, password } = args;
    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
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
        return new Error("Invalid credentials");
      }
      const data = await res.json();
      if (!data.user.token) {
        throw new Error("can't login without a token");
      }
      auth.login(data.user.token);
      return true;
    } catch (error) {
      console.error("error when logging in", error);
      return error as Error;
    }
  }

  public async getDefaultPreset(token: string): Promise<string | boolean> {
    headers = clearHeaders(headers);
    headers = setInitialHeaders(headers);
    headers = setAuthHeader(headers, token);
    try {
      const res = await fetch(`${API_URL}/user`, {
        method: 'GET',
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

  public async updateDefaultPreset(
    args: { name: string, token: string }
  ): Promise<void | Error> {
    try {
      const { name, token } = args;
      headers = clearHeaders(headers);
      headers = setInitialHeaders(headers);
      headers = setAuthHeader(headers, token);
      const res = await fetch(`${API_URL}/user/update-preset`, {
        method: 'PUT',
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

  public async getGifs(): Promise<Array<string> | void> {
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

  public async forgotPassword(email: string): Promise<boolean | void> {
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

  public async changePassword(
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

export default new ApiService();
