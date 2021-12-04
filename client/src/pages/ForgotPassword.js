import React, { useState } from 'react';
import API from "../utils/ApiService";

//audio player and big led box
const ForgotPassword = () => {

  const [ error, setError ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ email, setEmail ] = useState(""); 
  //if i dont explicitly use the name i defined in my schema the mutation result shape will only contain
  // the shape of the defined schema

  async function submitForgotPassword(event) {
    event.preventDefault();
    setLoading(true);
    try {
      if (!window.navigator.onLine) throw new Error("Internet is disconnected, please try again later.");
      await API.forgotPassword(email);
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    } catch(err) {
      setLoading(false);
      setError(err.message);
      console.error(err);
    }
  }

  const handleChange = (event) => {
    if (event.target.type === "email") {
      setEmail(event.target.value);
    }
  }

  return (
    <>
      <form className="form-card" onSubmit={submitForgotPassword}>
      <label
            htmlFor="email"
            className="form-email-label"
          >
            Email to send the reset request: 
          </label>
          <input
            required
            type="email"
            name="email"
            id="email-login"
            value={email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="form-email-input"
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
        {/* <div style={{ display: `${loading ? "block" : "none"}` }}>
          Loading
        </div> */}
        {
          loading 
          ?
          (
            <>
              <div style={{ display: "flex", justifyContent: "center"}}>
                <span>If there is an account with that email, the reset link is now being sent!</span>
              </div>
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
            </>
          )
          : null
        }
      </form>
    </>
  );
};

export default ForgotPassword;