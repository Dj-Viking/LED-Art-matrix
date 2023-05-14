import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import API from "../utils/ApiService";
import { Spinner } from "../components/Spinner";
import { getGlobalState } from "../store/store";
import { loggedInActions } from "../store/loggedInSlice";
import { formActions } from "../store/formSlice";

const Login: React.FC = (): JSX.Element => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { loginUsernameOrEmail, loginPassword } = getGlobalState(useSelector);
    const dispatch = useDispatch();

    function handleChange(event: any): void {
        if (event.target.type === "text") {
            dispatch(formActions.loginEmailChange(event.target.value));
        }
        if (event.target.type === "password") {
            dispatch(formActions.loginPasswordChange(event.target.value));
        }
    }

    // TODO: make async thunks out of logging in and signing up
    async function handleSubmit(event: any): Promise<void> {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            let booleanOrError;
            if (window.navigator.onLine) {
                booleanOrError = await API.login({
                    usernameOrEmail: loginUsernameOrEmail,
                    password: loginPassword,
                });
                if (!(booleanOrError instanceof Error)) {
                    setLoading(false);
                    setError("");
                    dispatch(loggedInActions.login());
                    history.push("/");
                }
                setLoading(false);
            } else {
                setError("\nInternet is disconnected, please try again later");
            }
        } catch (err) {
            setLoading(false);
            const error = err as Error;
            setError(error.message);
        }
    }

    return (
        <>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="form-card">
                    <label htmlFor="email" className="form-email-label">
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
                    <label htmlFor="password" className="form-password-label">
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
                    {
                        // login error rendering
                        error ? <div style={{ color: "red" }}>{error}</div> : null
                    }
                    <div className="form-button-container">
                        <button type="submit" disabled={false} className="form-btn">
                            Login
                        </button>
                        {loading ? (
                            <>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <span>Loading...</span>
                                </div>
                                <Spinner />
                            </>
                        ) : null}
                    </div>
                </form>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Link to="/forgotPassword">
                        <button
                            type="button"
                            style={{
                                cursor: "pointer",
                                backgroundColor: "transparent",
                                border: "none",
                                color: "white",
                                textDecoration: "none",
                            }}
                        >
                            Forgot Password?
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Login;
