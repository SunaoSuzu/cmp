import {useIdToken} from "../platform/UserContextProvider";
import React from "react";
import CrudApp from "./crud/CrudApp"
import ListMod from "./listMod/ListModApp"
import AppProvider from "./AppProvider";

const App = (props) => {
    const token = useIdToken();
    const def = props.def;
    def["token"] = token;
    switch (def.type) {
        case "listMod":{
            return (
                <AppProvider def={def}>
                    <ListMod {...props} />
                </AppProvider>
            );
        }
        default :{
            return (
                <AppProvider def={def}>
                    <CrudApp {...props} />
                </AppProvider>
            );
        }
    }
}
export default App;