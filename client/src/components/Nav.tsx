import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../actions/logged-in-actions";
import { MyRootState } from "../types";
import { AuthService as Auth } from "../utils/AuthService";
import "./aux-styles/navStyles.css";

const Nav: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const { loggedIn } = useSelector((state: MyRootState) => state.loggedInState);

    return (
        <>
            <nav>
                {loggedIn ? (
                    <section
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                        className="nav-container"
                    >
                        <div>
                            <Link
                                to="/"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                }}
                                className="nav-button"
                            >
                                <span
                                    style={{
                                        textDecoration: "none",
                                        color: "white",
                                    }}
                                >
                                    Home
                                </span>
                            </Link>
                        </div>
                        <div>
                            <a
                                data-testid="logout-btn"
                                href="/"
                                style={{
                                    textDecoration: "none",
                                    color: "white",
                                    marginLeft: "5px",
                                }}
                                className="nav-button"
                                onClick={() => {
                                    Auth.logout();
                                    dispatch(logout());
                                }}
                            >
                                Logout
                            </a>
                        </div>
                    </section>
                ) : (
                    <section
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                        className="nav-container"
                    >
                        <div>
                            <Link
                                to="/"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    marginRight: "5px",
                                    marginLeft: "5px",
                                }}
                                className="nav-button"
                            >
                                Home
                            </Link>
                        </div>
                        <div>
                            <Link
                                to="/signup"
                                role="link"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    marginRight: "5px",
                                    marginLeft: "5px",
                                }}
                                className="nav-button"
                            >
                                Sign Up
                            </Link>
                        </div>
                        <div>
                            <Link
                                to="/login"
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    marginLeft: "5px",
                                }}
                                className="nav-button"
                            >
                                Login
                            </Link>
                        </div>
                    </section>
                )}
            </nav>
        </>
    );
};

export default Nav;
