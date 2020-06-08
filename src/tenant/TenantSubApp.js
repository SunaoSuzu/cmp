import React from "react";
import App from "./TenantApp";

import { Provider } from "react-redux";
import createStore from "./module/TenantAppStore";

export default class TenantSubApp extends React.Component {
  constructor(props) {
    super(props);
    this.store = createStore();
  }
  render() {
    return (
      <Provider store={this.store}>
        <App />
      </Provider>
    );
  }
}
