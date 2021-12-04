import React, { useState } from 'react';

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
      // const forgotResponse = await forgotPassword
      // (
      //   {
      //     variables: {
      //       email: email,
      //     }
      //   }
      // );
      // console.log("check forgot response", forgotResponse);
      // if (
      //   forgotResponse.data && 
      //   forgotResponse.data.forgotPassword && 
      //   !forgotResponse.data.forgotPassword.hasOwnProperty("errors")
      // ) {
      //   console.log("no errors!!");
      //   setTimeout(() => {
      //     window.location.replace("/");
      //   }, 4000);
      //   setTimeout(() => {
      //     setLoading(false);
      //   }, 5000);
      // }
      throw new Error("forgot password not done yet");
    } catch(err) {
      setLoading(false);
      console.error(err);
    }
  }

  const handleChange = (event) => {
    if (event.target.type === "text") {
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
            type="text"
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
          error && error.message
          ?
          (
            <div
              style={{color: 'red'}}
            >
              {` ${error && error.message ? `${error.message}` : ""}`}
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