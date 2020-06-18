import React from "react";
import { Route, Switch } from "react-router";
import SignIn from "./signin/SignIn";
import SignUp from "./signin/SignUp";
import PwdChg from "./signin/PwdChg";
import {useAuthenticateInfo,useIsAuthenticated} from "./UserContextProvider";
import App from "./NavigationContainer";

const MainApp = () => {
    const isAuthenticated = useIsAuthenticated();
    const {isForcePwdChg} = useAuthenticateInfo();
    console.log(isAuthenticated + ":" + isForcePwdChg);
    if(isForcePwdChg){
        return (
            <Switch>
                <Route path="/" component={PwdChg} />
            </Switch>
        )
    } else if(isAuthenticated){
        return (
            <Switch>
                <Route path="/" component={App} />
            </Switch>
        )
    } else {
        return (
            <Switch>
                <Route exact path="/signIn" component={SignIn} />
                <Route exact path="/signUp" component={SignUp} />
                <Route path="/" component={SignIn} />
            </Switch>
        )
    }
}
export default MainApp;