import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';

import {starterEvents} from './events';

// redux stuff
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { logger } from 'redux-logger'

const events = (state=starterEvents,action) =>{
  if (action.type === "SET_EVENTS") return action.payload
  return state
};

const store = createStore(combineReducers({
  events
}), applyMiddleware(logger))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
