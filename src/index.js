import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

import PostMessageRouter from "./platform/PostMessageRouter";
import { Route, Switch } from "react-router-dom";
import theme from "./theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import ClientContextProvider from "./platform/ClientContextProvider"
import TenantSubApp from "./tenant/TenantSubApp";
import { createBrowserHistory } from 'history';

const history = createBrowserHistory({basename:"/cmp/"});


ReactDOM.render(
    <React.StrictMode>
      <ClientContextProvider>
          <PostMessageRouter history={history}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Switch>
                <Route path="/tenant" component={TenantSubApp} />
              </Switch>
            </ThemeProvider>
          </PostMessageRouter>
      </ClientContextProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
