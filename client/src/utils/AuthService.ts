import decode from "jwt-decode";
import { MyJwtData } from "../types";

class AuthService {
  public static getToken(): string | false {
    // Retrieves the user token from localStorage
    const token = localStorage.getItem("id_token");
    if (token) {
      return token;
    } 
      return false;
  }

  public static loggedIn(): boolean {
    // Checks if there is a saved token and it's still valid
    const token = AuthService.getToken();
    if (typeof token === "string") {
      if (!AuthService.isTokenExpired(token)) {
        return true;
      }
    }
    return false;
  }

  public static isTokenExpired(token: string): boolean {
    const decoded = decode(token) as MyJwtData;
    if (decoded.exp as number < Date.now() / 1000) {
      return true;
    } return false;
  }

  public static login(token: string): boolean | void {
    // Saves user token to localStorage
    localStorage.setItem("id_token", token);
    if (AuthService.getToken()) return true;
  }

  public static logout(): void {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
  }
}

export default AuthService;
export { AuthService };
