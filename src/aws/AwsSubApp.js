import React from "react";

import { Provider } from 'react-redux';
import createStore from "./AwsAppStore";
import {Route, Switch} from "react-router-dom";
import AwsVpcList from "./asset/AwsVpcList";


export default class AwsSubApp extends React.Component {
    constructor(props) {
        super(props);
        this.store = createStore();
        console.log("this.store=" + this.store);
    }
    render() {
        return (
            <Provider store={this.store}>
                <Switch>
                    <Route exact path={"/aws/asset"} component={AwsVpcList} />
                </Switch>
            </Provider>
        )
    }
}