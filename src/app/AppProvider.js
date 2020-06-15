import APPContext from "./AppContext";
import React from "react";

function AppProvider({def , children}) {
    return React.createElement(APPContext.Provider, {
        value: def
    }, children);
}

export function useDef(){
    return React.useContext(APPContext);
}

export default AppProvider;