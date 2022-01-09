// eslint-disable-next-line
// @ts-ignore
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import API from "../utils/ApiService";
import {
  loginEmailChange,
  loginEmailCompleted,
  loginPasswordChange,
  loginPasswordCompleted
} from "../actions/login-form-actions";
import { Spinner } from "../components/Spinner";
import { MyRootState } from "../types";

const Login = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { usernameOrEmail, password } = useSelector((state: MyRootState) => state.loginFormState);
  const dispatch = useDispatch();

  function handleChange(event: any): void {
    if (event.target.type === "text") {
      dispatch(loginEmailChange(event.target.value));
      dispatch(loginEmailCompleted(event.target.value));
    }
    if (event.target.type === "password") {
      dispatch(loginPasswordChange(event.target.value));
      dispatch(loginPasswordCompleted(event.target.value));
    }
  }

  async function handleSubmit(event: any): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      let booleanOrError;
      if (window.navigator.onLine) {
        booleanOrError = await API.login({ usernameOrEmail, password });
        console.log("what is boolean or error on login", booleanOrError);
        switch (true) {
          case !booleanOrError || (booleanOrError instanceof Error): 
            setError(`${booleanOrError}`);
          break;
          case booleanOrError === true: 
            setLoading(false);
            setError("");
          break;
          default: break;
        }
        setLoading(false);
      } else {
        setError("\nInternet is disconnected, please try again later");
      }
    } catch (err) {
      setLoading(false);
      const error = err as Error;
      setError(error.message);
      console.log("error when logging in", error);
    }
  }

  return (
    <>
      <div
        className="form-container"
      >
        <form 
          onSubmit={handleSubmit}
          className="form-card"
        >
          <label
            htmlFor="email"
            className="form-email-label"
          >
            Email or Username: 
          </label>
          <input
            required
            type="text"
            name="email"
            id="email-login"
            onChange={handleChange}
            placeholder="example@email.com | my_username"
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
            type="password"
            name="password"
            id="password-login"
            onChange={handleChange}
            placeholder="***************"
            className="form-password-input"
            autoComplete="off"
          />
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
          <div
            className="form-button-container"
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link 
                to="/forgotPassword"
                style={{
                  color: "white",
                  textDecoration: "none"
                }}
              >
                Forgot Password?

              </Link>
            </div>
            <button
              type="submit"
              disabled={false}
              className="form-btn"
            >
              Login
            </button>
            {
              loading 
              ? (
                <>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <span>Loading...</span>
                  </div>
                  <Spinner />
                </>
)
              : null
            }
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
