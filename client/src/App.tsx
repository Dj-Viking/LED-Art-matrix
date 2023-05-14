/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import { BrowserRouter, Router, Route, useLocation } from "react-router-dom";
import "./index.css";
import { createBrowserHistory } from "history";
import SplashHeader from "./components/SplashHeader";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import { Provider } from "react-redux";
import KeyListenerWrapper from "./components/KeyListenerWrapper";
import { LedWindow } from "./pages/LedWindow";
import { toolkitStore } from "./store/store";
import { Test } from "./pages/test";

// const store = createStore(
//     combinedReducers,
//     // @ts-expect-error this will exist in the browser
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

export const HiddenLocationDisplay = (): JSX.Element => {
    const location = useLocation();
    return (
        <div
            style={{ visibility: "hidden", height: 0, width: 0, color: "black" }}
            data-testid="location-display"
        >
            {location.pathname}
        </div>
    );
};

export function isLedWindow(): boolean {
    return window.location.pathname.includes("LedWindow");
}

const App: React.FC = (): JSX.Element => {
    const history = createBrowserHistory();
    return (
        <>
            <Provider store={toolkitStore}>
                <Router history={history}>
                    <BrowserRouter>
                        <KeyListenerWrapper>
                            {!isLedWindow() && <SplashHeader />}
                            <Route exact path="/" component={Home} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/signup" component={Signup} />
                            <Route exact path="/forgotPassword" component={ForgotPassword} />
                            <Route exact path="/test" component={Test} />
                            <Route exact path="/ledWindow" component={LedWindow} />
                            <Route
                                exact
                                path="/changePassword/:token?"
                                component={ChangePassword}
                            />
                        </KeyListenerWrapper>
                        <HiddenLocationDisplay />
                    </BrowserRouter>
                </Router>
            </Provider>
        </>
    );
};

export default App;
