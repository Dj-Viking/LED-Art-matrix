//IMPORT REACT
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//ROUTER
// import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

//APOLLO
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

// //AUTH
import Auth from './utils/auth.js';

//CSS
import './index.css';

// //COMPONENTS
import SplashHeader from './components/SplashHeader';

//PAGES
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';

//establish apollo client with apollo server
const client = new ApolloClient({
  request: (operation) => {
    const gotToken = Auth.getToken();
    // const token = localStorage.getItem('id_token');
    operation.setContext({
      headers: {
        authorization: gotToken ? `Bearer ${gotToken}` : ''
      }
    });
  },
  uri: '/graphql'
});

const App = () => {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <SplashHeader />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
          </Switch>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
