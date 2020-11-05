//IMPORT REACT
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//ROUTER
// import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
//APOLLO
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

//CSS
import './index.css';


//COMPONENTS
// import AudioPlayer from './components/AudioPlayer';
// import BigLedBox from './components/BigLedBox';
import Header from './components/Header';


//PAGES
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';

//establish apollo client with apollo server
const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem('id_token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
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
          <Header />
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
