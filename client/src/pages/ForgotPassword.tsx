import React, { useState } from "react";
import API from "../utils/ApiService";
import { Spinner } from "../components/Spinner";

// audio player and big led box
const ForgotPassword: React.FC = (): JSX.Element => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); 
  // if i dont explicitly use the name i defined in my schema the mutation result shape will only contain
  // the shape of the defined schema

  async function submitForgotPassword(event: React.SyntheticEvent): Promise<void> {
    event.preventDefault();
    setLoading(true);
    try {
      if (!window.navigator.onLine) throw new Error("Internet is disconnected, please try again later.");
      await API.forgotPassword(email);
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    } catch (err) {
      setLoading(false);
      const error = err as Error;
      setError(error.message);
      console.error(error);
    }
  }

  // eslint-disable-next-line
  const handleChange = (event: any): void => {
    if (event.target.type === "email") {
      setEmail(event.target.value);
    }
  };

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
        {
          loading 
          ? (
            <>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span>If there is an account with that email, the reset link is now being sent!</span>
              </div>
              <Spinner />
            </>
          )
          : null
        }
      </form>
    </>
  );
};

export default ForgotPassword;
