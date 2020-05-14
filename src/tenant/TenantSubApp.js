import React from "react";
import App from "./TenantAppContainer";

import { Provider } from "react-redux";
import createStore from "./TenantAppStore";

export default class TenantSubApp extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore();
    console.log("this.store=" + this.store);
  }
  render() {
    return (
      <Provider store={this.store}>
        <App />
      </Provider>
    );
  }
}
