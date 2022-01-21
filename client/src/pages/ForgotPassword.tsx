import React, { useEffect, useState } from "react";
import API from "../utils/ApiService";
import { Spinner } from "../components/Spinner";
import { useHistory } from "react-router-dom";

// audio player and big led box
const ForgotPassword: React.FC = (): JSX.Element => {
  const history = useHistory();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(""); 
  const [disabled, setDisabled] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  // if i dont explicitly use the name i defined in my schema the mutation result shape will only contain
  // the shape of the defined schema

  async function submitForgotPassword(event: React.SyntheticEvent): Promise<void> {
    event.preventDefault();
    setLoading(true);
    try {
      if (!window.navigator.onLine) throw new Error("Internet is disconnected, please try again later.");
      setSubmitted(true);
      const res = await API.forgotPassword(email);
      if (res) {
        setTimeout(() => {
          setLoading(false);
          history.replace("/");
        }, 5000);
      }
    } catch (err) {
      setSubmitted(false);
      setLoading(false);
      const error = err as Error;
      setError(error.message);
    }
  }

  useEffect(() => {
    //re-render when text changes
    email.length > 0 ? setDisabled(false) : setDisabled(true);
    // re-render when submitted
    submitted && setDisabled(true);
  }, [email, disabled, setDisabled, submitted]);

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
        <button disabled={disabled} className={disabled ? "form-btn-disabled" : "form-btn"} type="submit">
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
