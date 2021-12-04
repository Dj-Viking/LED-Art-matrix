import React, { useState, useEffect } from 'react';
//AUTH
import Auth from '../utils/auth';

//audio player and big led box
const ChangePassword = () => {

  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ errMsg, setErrMsg ] = useState("");
  const [ password, setPassword ] = useState(""); 
  const [ confirmPass, setConfirmPass ] = useState("");
  //if i dont explicitly use the name i defined in my schema the mutation result shape will only contain
  // the shape of the defined schema

  const [ urlParam, setUrlParam ] = useState("");

  useEffect(() => {
    //get the token inside the URL
    // console.log("url params initially", urlParam);
    // if (window && window.location && window.location.pathname) {
    //   console.log("we have a window and a pathname", window.location.pathname);
    //   const token = window.location.pathname.split("/")[2];
    //   setUrlParam(token);
    //   console.log("what is params state now should be a token", urlParam);
    // }
    return () => void 0;
  }, [urlParam, setUrlParam]);
      
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
      return setErrMsg("Passwords do not match.");
    } else {
      setErrMsg("");
    }
    
    try {
      throw new Error("change password page not done yet");
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
          error || errMsg
          ?
          (
            <div
              style={{color: 'red'}}
            >
              {` ${error && error.message ? `${error.message || errMsg}` : `${errMsg}`}`}
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
            <div style={{ display: "flex", justifyContent: "center"}}>
              <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          : null
        }
      </form>
    </>
  );
};

export default ChangePassword;