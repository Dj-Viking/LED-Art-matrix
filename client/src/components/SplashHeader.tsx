import React from "react";
import { AuthService as Auth } from "../utils/AuthService";
import Nav from "./Nav";

const SplashHeader: React.FC = (): JSX.Element => (
    <>
        {Auth.loggedIn() ? (
            <>
                <div
                    style={{
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    LED Art Matrix
                </div>
            </>
        ) : (
            <>
                <div
                    style={{
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    LED Art Matrix
                </div>
            </>
        )}
        {/* // option to login signup */}
        <Nav />
    </>
);
//
// show preview of the led controls with disabled buttons

export default SplashHeader;
