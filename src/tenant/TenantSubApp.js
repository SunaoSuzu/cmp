import React from "react";
import App from "./TenantApp";

import { Provider } from "react-redux";
import createStore from "./module/TenantAppStore";
import {useIdToken} from "../platform/ClientContextProvider";

export default class TenantSubApp extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore();
    const token = useIdToken();
    console.log("token" + JSON.stringify(token))
  }
  render() {
    return (
      <Provider store={this.store}>
        <App />
      </Provider>
    );
  }
}
