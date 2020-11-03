//IMPORT REACT
import React from 'react';
//ROUTER
// import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
//APOLLO
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

//CSS
import './index.css';


//COMPONENTS
import AudioPlayer from './components/AudioPlayer';
import BigLedBox from './components/BigLedBox';

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
        <AudioPlayer/>
        <BigLedBox />
      </ApolloProvider>
    </>
  );
}

export default App;
