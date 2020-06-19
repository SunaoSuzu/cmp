import React from "react";
import configStore from "./ConfigStore";
import { Provider } from 'react-redux'
import MainApp from "./MainApp"
import AppProvider from "./AppProvider"
import {useIdToken} from "../UserContextProvider";

const AppLauncher = (props) => {
    const token = useIdToken();
    const def = props.def;
    def["token"] = token;
    return <App def={props.def} />;
}


class App extends React.Component {
    constructor(props) {
        super(props)
        this.store = configStore(props.def,props.token);
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

export default AppLauncher;