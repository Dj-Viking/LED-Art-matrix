import React, { useState, useEffect } from 'react';
import Auth from '../utils/auth';
import API from "../utils/ApiService";
import { Spinner } from "../components/Spinner";
const ChangePassword = () => {

  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ password, setPassword ] = useState(""); 
  const [ confirmPass, setConfirmPass ] = useState("");
  //if i dont explicitly use the name i defined in my schema the mutation result shape will only contain
  // the shape of the defined schema

  const [ urlToken, setUrlParam ] = useState("");

  useEffect(() => {
    //get the token inside the URL
    console.log("url params initially", urlToken);
    if (window && window.location && window.location.pathname) {
      console.log("we have a window and a pathname", window.location.pathname);
      const token = window.location.pathname.split("/")[2];
      setUrlParam(token);
      console.log("what is params state now should be a token", urlToken);
    }
    return void 0;
  }, [urlToken, setUrlParam]);
      
  function comparePassword(newPass, confirmPass) {
    if (newPass !== confirmPass) return false;
    else return true;
  }

  async function submitChangePassword(event) {
    event.preventDefault();
    setLoading(true);


    const isMatched = comparePassword(password, confirmPass);
    if (!isMatched) {
      setLoading(false);
      return setError("Passwords do not match.");
    } else {
      setError("");
    }
    
    try {
      const res = await API.changePassword({ password, token: urlToken });
      if (res.done) Auth.login(res.token);
    } catch(err) {
      setLoading(false);
      console.log(err);
    }
  }

  function handlePassChange(event) {
    if (event.target.id === "password") {
      setPassword(event.target.value);
    }
  }
  function handleConfirmPassChange(event) {
    if (event.target.id === "confirm-password") {
      setConfirmPass(event.target.value);
    }
  }

  return (
    <>
      <form className="form-card" onSubmit={submitChangePassword}>
        <label
          htmlFor="email"
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
          placeholder="***************"
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
          placeholder="***************"
          className="form-password-input"
          autoComplete="off"
        />
        <button className='form-btn' type="submit">
          Submit
        </button>
        {//login error rendering
          error
          ?
          (
            <div
              style={{color: 'red'}}
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
          ?
            <Spinner />
          : 
            null
        }
      </form>
    </>
  );
};

export default ChangePassword;