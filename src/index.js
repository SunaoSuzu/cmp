import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './NavigationContainer';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import createStore from './NavigationStore';
import { ConnectedRouter } from 'connected-react-router'
import history from './asset/history';
import {Route, Switch} from "react-router";

const store = createStore();
ReactDOM.render(
  <React.StrictMode>
      <Provider store={store} >
          <ConnectedRouter history={history}>
              <Switch>
                  <Route path="/" component={App}></Route>
              </Switch>
          </ConnectedRouter>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
