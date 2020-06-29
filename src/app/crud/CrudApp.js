import React from "react";
import configStore from "./ConfigStore";
import { Provider } from 'react-redux'
import CrudMainApp from "./CrudMainApp"


class CrudApp extends React.Component {
    constructor(props) {
        super(props)
        this.store = configStore(props.def,props.token);
    }

    render() {
        return (
            <Provider store={this.store}>
                <CrudMainApp />
            </Provider>
        )
    }
}

export default CrudApp;