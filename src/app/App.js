import React from "react";
import configStore from "./ConfigStore";
import { Provider } from 'react-redux'
import MainApp from "./MainApp"
import AppProvider from "./AppProvider"


class App extends React.Component {
    constructor(props) {
        super(props)
        this.store = configStore(props.def);
        this.def = props.def;
    }

    render() {
        return (
            <AppProvider def={this.def} >
                <Provider store={this.store}>
                    <MainApp />
                </Provider>
            </AppProvider>
        )
    }
}

export default App;