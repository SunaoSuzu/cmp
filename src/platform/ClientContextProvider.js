/**
 * 利用者毎の情報を管理するグローバルContext
 **/
import React from "react"
import * as auth from './Auth'

const ClientContext = React.createContext();


const ClientContextProvider = props => {

    return (
        <ClientContext.Provider value={{
            }
        } >
            {props.children}
        </ClientContext.Provider>
    );
};

export function useIdToken(){
    return auth.getToken();
}

export default ClientContextProvider;