// @ts-expect-error need react in scope for JSX
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../utils/ApiService";
import {
  signupUsernameChange,
  signupUsernameCompleted,
  signupEmailChange,
  signupEmailCompleted,
  signupPasswordChange,
  signupPasswordCompleted
} from "../actions/signup-form-actions";
import { Spinner } from "../components/Spinner";
import { MyRootState } from "../types";
 
const Signup = (): JSX.Element => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { username, email, password } = useSelector((state: MyRootState) => state.signupFormState);
  const dispatch = useDispatch();
  
  async function handleSubmit(event: any): Promise<void> {
    event.preventDefault();
    setLoading(true);
    try {
      if (window.navigator.onLine) {
        await API.signup({ username, email, password });
        setLoading(false);
      } else {
        setError("\nInternet is disconnected, please try again later");
      }
    } catch (err) {
      setLoading(false);
      const error = err as Error;
      setError(error.message);
      console.log("error when signing up", error);
    }
  } 

  function handleChange(event: any): void {
    if (event.target.type === "text") {
      dispatch(signupUsernameChange(event.target.value));
      dispatch(signupUsernameCompleted(event.target.value));
    }
    if (event.target.type === "email") {
      dispatch(signupEmailChange(event.target.value));
      dispatch(signupEmailCompleted(event.target.value));
    }
    if (event.target.type === "password") {
      dispatch(signupPasswordChange(event.target.value));
      dispatch(signupPasswordCompleted(event.target.value));
    }
  }

  return (
    <>
      <div
        className="form-container"
      >
        <form 
          className="form-card"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="username"
            className="form-username-label"
          >
            Username:
          </label>
          <input
            required 
            type="text"
            name="username"
            onChange={handleChange}
            placeholder="my_username"
            className="form-username-input"
            autoComplete="off"
          />
          <label
            htmlFor="email"
            className="form-email-label"
          >
            Email:
          </label>
          <input 
            required
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="example@email.com"
            className="form-email-input"
            autoComplete="off"
          />
          <label
            htmlFor="password"
            className="form-password-label"
          >
            Password:
          </label>
          <input 
            required
            className="form-password-input"
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="***************"
            autoComplete="off"
          />
          {
          error 
          ? (
            <>
              <div
                style={{ color: "red" }}
              >
                An error happened during the signup process!
                {error}
              </div>
            </>
          )
          : null
        }
          <div
            className="form-button-container"
          >
            <button
              type="submit"
              disabled={false}
              className="form-btn"
            >
              Sign Up
            </button>
            {
          loading 
          ? <Spinner />
          : null
        }
          </div> 
        </form>
      </div>
    </>
  );
};

export default Signup;
