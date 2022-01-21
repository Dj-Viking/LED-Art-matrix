import React, { useState, useEffect } from "react";
import { AuthService as Auth } from "../utils/AuthService";
import API from "../utils/ApiService";
import { useHistory } from "react-router-dom";
import { Spinner } from "../components/Spinner";

const ChangePassword: React.FC = (): JSX.Element => {
  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(""); 
  const [confirmPass, setConfirmPass] = useState("");
  // if i dont explicitly use the name i defined in my schema the mutation result shape will only contain
  // the shape of the defined schema

  const [urlToken, setUrlParam] = useState("");

  useEffect(() => {
    // get the token inside the URL
    if (window && window.location && window.location.pathname) {
      const token = window.location.pathname.split("/")[2];
      setUrlParam(token);
    }
    return void 0;
  }, [urlToken, setUrlParam]);
      
  function comparePassword(newPass: string, confirmPass: string): boolean {
    if (newPass !== confirmPass) return false;
    return true;
  }

  async function submitChangePassword(event: React.SyntheticEvent): Promise<void | boolean> {
    event.preventDefault();
    setLoading(true);

    const isMatched = comparePassword(password, confirmPass);
    if (!isMatched) {
      setLoading(false);
      return setError("Passwords do not match.");
    } 
      setError("");
    
    try {
      const res = await API.changePassword({ password, token: urlToken }) as { done: boolean, token: string };
      if (res.done) {
        Auth.login(res.token);
        history.replace("/");
      }
    } catch (err) {
      setLoading(false);
      return void 0;
    }
  }

  // eslint-disable-next-line
  function handlePassChange(event: any): void {
    if (event.target.id === "password") {
      setPassword(event.target.value);
    }
  }
  
  // eslint-disable-next-line
  function handleConfirmPassChange(event: any): void {
    if (event.target.id === "confirm-password") {
      setConfirmPass(event.target.value);
    }
  }

  return (
    <>
      <form className="form-card" onSubmit={submitChangePassword}>
        <label
          htmlFor="password"
          className="form-email-label"
        >
          New Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={password}
          onChange={handlePassChange}
          placeholder="New Password"
          className="form-password-input"
          autoComplete="off"
        />
        <label
          htmlFor="email"
          className="form-email-label"
        >
          Confirm Password
        </label>
        <input
          type="password"
          name="confirm-password"
          id="confirm-password"
          required
          value={confirmPass}
          onChange={handleConfirmPassChange}
          placeholder="Confirm Password"
          className="form-password-input"
          autoComplete="off"
        />
        <button className="form-btn" type="submit">
          Submit
        </button>
        {// login error rendering
          error
          ? (
            <div
              style={{ color: "red" }}
            >
              {error}
            </div>
          )
          : null
        }
        <div style={{ display: `${loading ? "block" : "none"}` }}>
          Loading
        </div>
        {
          loading 
          ? <Spinner />
          : null
        }
      </form>
    </>
  );
};

export default ChangePassword;
