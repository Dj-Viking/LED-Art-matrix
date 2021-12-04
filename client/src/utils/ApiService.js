import auth from "./auth";
import { setInitialHeaders, clearHeaders, setAuthHeader } from "../utils/headersUtils";
import { API_URL } from "../constants";
let headers = {}
class ApiService {
  /**
   * 
   * @param {{username: string, email: string, password: string}} args 
   * @returns {Promise<boolean | Error>} 
   */
  async signup(args) {
    headers = clearHeaders(headers);
    headers = setInitialHeaders(headers);
    const { username, password, email } = args;
    try {
      const res = await fetch(API_URL + "/user", {
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
      return error;
    }
  }
  /**
   * 
   * @param {{email: string, password: string}} args 
   * @returns {Promise<boolean | Error>}
   */
  async login(args) {
    headers = clearHeaders(headers);
    headers = setInitialHeaders(headers);
    const { email, password } = args;
    try {
      let res;
      res = await fetch(API_URL + "/user/login", {
        method: 'POST',
        body: JSON.stringify({
          email,
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
      return error;
    }
  }
  /**
   * 
   * @param {string} token token from local storage
   * @returns {Promise<string | boolean>} preset name to set on the led box
   */
  async getDefaultPreset(token){
    headers = clearHeaders(headers);
    headers = setInitialHeaders(headers);
    headers = setAuthHeader(headers, token);
    try {
      const res = await fetch(API_URL + "/user", {
        method: 'GET',
        headers,
      });
      const data = await res.json();
      if (!!data.error) throw new Error(`${data.error}`);
      return data.preset.presetName;
    } catch (error) {
      console.error("error when getting default preset", error);
      return false;
    }
  }
  /**
   * 
   * @param {{name: string, token: string}} args 
   * @returns {Promise<void | Error>} 
   */
  async updateDefaultPreset(args) {
    try {
      const { name, token } = args;
      headers = clearHeaders(headers);
      headers = setInitialHeaders(headers);
      headers = setAuthHeader(headers, token);
      const res = await fetch(API_URL + "/user/update-preset", {
        method: 'PUT',
        body: JSON.stringify({ defaultPreset: name }),
        headers,
      });
      if (res.ok) return void 0;
    } catch (error) {
      console.error("error when updating default preset", error);
      return error;
    }
    
  }
  /**
   * @returns {Promise<Array<string>>}
   */
  async getGifs() {
    headers = clearHeaders(headers);
    headers = setInitialHeaders(headers);
    try {
      const res = await fetch(API_URL + "/gifs/get", {
        method: "GET",
        headers,
      });
      const data = await res.json();
      return data.gifs;
    } catch (error) {
      console.error("error when trying to get gifs", error);
    }
  }
  /**
   * 
   * @param {string} email 
   * @returns {Promise<void | boolean>}
   */
  async forgotPassword(email) {
    try {
      headers = clearHeaders(headers);
      headers = setInitialHeaders(headers);
      let res;
      res = await fetch(API_URL + "/user/forgot", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers
      });

    } catch (error) {
      console.error("error when submitting forgot password request", error);
    }
  }

  /**
   * 
   * @param {{password: string, token: string}} args 
   * @returns {Promise<{done: true, token: string}>}
   */
  async changePassword(args) {
    try {
      headers = clearHeaders(headers);
      headers = setInitialHeaders(headers);
      const { password, token } = args;
      let res;
      res = await fetch(API_URL + `/user/change-pass`, {
        method: "PUT",
        body: JSON.stringify({ password, token }),
        headers,
      });
      if (res.status !== 200) 
        throw new Error("Couldn't change password at this time");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("error when changing password", error);
    }
  }
}

export default new ApiService();