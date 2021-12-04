import auth from "./auth";
import { setInitialHeaders, clearHeaders, setAuthHeader } from "../utils/headersUtils";
import { API_URL } from "../constants";
let headers = {}
class ApiService {
  constructor() {}
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
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(
          username,
          email,
          password
        ),
        headers,
      });
      const data = await res.json();
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
    for (const [key, value] of Object.entries(headers)) {
      console.log("key", key, "\nvalue", value);
    }
    const { email, password } = args;
    try {
      const res = await fetch(API_URL + "/user/login", {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
        headers,
      });
      const data = await res.json();
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
   * @returns {string} preset name to set on the led box
   */
  async getDefaultPreset(token){
    headers = clearHeaders(headers);
    headers = setInitialHeaders(headers);
    headers = setAuthHeader(headers, token);
    try {
      headers.append("authorization", `Bearer ${token}`);
      const res = await fetch(API_URL, {
        method: 'GET',
        headers,
      });
      return await res.json().data.preset;
    } catch (error) {
      console.error("error when getting default preset", error);
      return error;
    }
  }
  /**
   * 
   * @param {{name: string, token: string}} args 
   * @returns {Promise<boolean | Error>} 
   */
  async updateDefaultPreset(args) {
    try {
      const { name, token } = args;
      headers = clearHeaders(headers);
      headers = setInitialHeaders(headers);
      headers = setAuthHeader(headers, token);
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ defaultPreset: name }),
        headers,
      });
      if (res.ok) return true;
    } catch (error) {
      console.error("error when updating default preset", error);
      return error;
    }
    
  }
}

export default new ApiService();