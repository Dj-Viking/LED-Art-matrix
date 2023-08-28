import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../utils/ApiService";
import { Spinner } from "../components/Spinner";
import { loggedInActions } from "../store/loggedInSlice";
import { formActions } from "../store/formSlice";
import { useHistory } from "react-router-dom";
import { getGlobalState } from "../store/store";

const Signup: React.FC = (): JSX.Element => {
    const history = useHistory();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signupUsername, signupEmail, signupPassword } = getGlobalState(useSelector);
    const dispatch = useDispatch();

    async function handleSubmit(event: any): Promise<void> {
        event.preventDefault();
        setLoading(true);
        try {
            if (window.navigator.onLine) {
                await API.signup({
                    username: signupUsername,
                    email: signupEmail,
                    password: signupPassword,
                });
                dispatch(loggedInActions.login());
                setLoading(false);
                history.push("/");
            } else {
                setError("\nInternet is disconnected, please try again later");
            }
        } catch (err) {
            setLoading(false);
            const error = err as Error;
            setError(error.message);
        }
    }

    function handleChange(event: any): void {
        if (event.target.type === "text") {
            dispatch(formActions.signupUsernameChange(event.target.value));
        }
        if (event.target.type === "email") {
            dispatch(formActions.signupEmailChange(event.target.value));
        }
        if (event.target.type === "password") {
            dispatch(formActions.signupPasswordChange(event.target.value));
        }
    }

    return (
        <>
            <div className="form-container">
                <form className="form-card" onSubmit={handleSubmit}>
                    <label htmlFor="username" className="form-username-label">
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
                    <label htmlFor="email" className="form-email-label">
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
                    <label htmlFor="password" className="form-password-label">
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
                    {error ? (
                        <>
                            <div style={{ color: "red" }}>
                                An error happened during the signup process!
                                {error}
                            </div>
                        </>
                    ) : null}
                    <div className="form-button-container">
                        <button type="submit" name="signup-button" disabled={false} className="form-btn">
                            Sign Up
                        </button>
                        {loading ? <Spinner /> : null}
                    </div>
                </form>
            </div>
        </>
    );
};

export default Signup;
