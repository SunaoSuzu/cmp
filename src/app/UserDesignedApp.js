import React from "react";
import {useMenuOption} from "../platform/UserContextProvider";
import App from "./App"

const UserDesignedApp = (props) => {
    const  appId = props.match.params.appId;
    const  def   = useMenuOption(appId);
    console.log("appId:" + appId)
    console.log("def:" + JSON.stringify(def))
    return <App def={def}/>
}
export default UserDesignedApp;