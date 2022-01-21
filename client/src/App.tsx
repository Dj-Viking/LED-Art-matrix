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
import { createStore } from "redux";
import allReducers from "./reducers";

const store = createStore(
  allReducers,
  // @ts-expect-error this will exist in the browser
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const HiddenLocationDisplay = (): JSX.Element => {
	const location = useLocation();
	return (
		<div 
			style={{ display: "hidden" }} 
			data-testid="location-display"
		>
			{location.pathname}
		</div>
	);
};

const App: React.FC = (): JSX.Element => {
	const history = createBrowserHistory();
	return (
		<>
			<Provider store={store}>
				<Router history={history}>
					<BrowserRouter>
						<SplashHeader />
						<Route exact path="/" component={Home} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/signup" component={Signup} />
						<Route exact path="/forgotPassword" component={ForgotPassword} />
						<Route exact path="/changePassword/:token?" component={ChangePassword} />
						<HiddenLocationDisplay />
					</BrowserRouter>
				</Router>
			</Provider>
		</>
	);
};

export default App;
