import auth from "./auth";
import { API_URL } from "../constants";
class ApiService {
  constructor() {}
  /**
   * 
   * @param {{username: string, email: string, password: string}} args 
   * @returns {Promise<void>} 
   */
  async signup(args) {
    const { username, password, email } = args;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(
          username,
          email,
          password
        ),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      auth.login(data.token);
      return void 0;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  /**
   * 
   * @param {{email: string, password: string}} args 
   * @returns {Promise<void>}
   */
  async login(args) {
    const { email, password } = args;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(
          email,
          password
        ),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      auth.login(data.user.token);
      return void 0;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}

export default new ApiService();