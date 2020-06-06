import React from "react";
import configStore from "./ConfigStore";
import { Provider } from 'react-redux'
import OperationApp from "./OperationApp";

const store = configStore();

const OperationSubApp = props => {
    return (
        <Provider store={store}>
            <OperationApp />
        </Provider>
    );
}
export default OperationSubApp;