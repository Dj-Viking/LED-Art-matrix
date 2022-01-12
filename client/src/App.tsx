import React from "react";
// ROUTER
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// CSS
import "./index.css";

// //COMPONENTS
import SplashHeader from "./components/SplashHeader";

// PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";

const App: React.FC = (): JSX.Element => (
  <>
    <Router>
      <SplashHeader />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route exact path="/changePassword/:token?" component={ChangePassword} />
      </Switch>
    </Router>
  </>
  );

export default App;
