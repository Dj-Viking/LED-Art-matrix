import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

//something to consider, 
// different way to make component hooks
// import React from 'react';

// const MyComponents = {
//   DatePicker: function DatePicker(props) {
//     return <div>Imagine a {props.color} datepicker here.</div>;
//   }
// }

// function BlueDatePicker() {
//   return <MyComponents.DatePicker color="blue" />;
// }

//REDUX
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import allReducers from './reducers';
const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
console.log(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={App} />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

serviceWorkerRegistration.register();