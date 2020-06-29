import React from "react";
import configStore from "./ConfigStore";
import { Provider } from 'react-redux'
import MainApp from "./ListModMainApp"


class ListModApp extends React.Component {
    constructor(props) {
        super(props)
        this.store = configStore(props.def,props.token);
    }

    render() {
        console.log()
        return (
            <Provider store={this.store}>
                <MainApp />
            </Provider>
        )
    }
}

export default ListModApp;