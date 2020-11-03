import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './components/BigLedBox/rainbowStart/styles/style.css';
import './components/BigLedBox/rainbowV2/styles/style.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

//something to consider...
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
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
