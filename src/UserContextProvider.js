/**
 * 利用者毎の情報を管理するグローバルContext
 **/
import React from "react"

const UserContext = React.createContext();

const initialState = {
    user: {
        isAuthenticated: true,
        profile: 'sunao@sutech.co.jp',
        name   : 'sunao@sutech.co.jp',
    }
};

const ON_SUCCESS_SIGN_IN = "ON_SUCCESS_SIGN_IN";
const ON_SUCCESS_SIGN_OUT = "ON_SUCCESS_SIGN_OUT";

const userReducer = (state, action) => {
    switch (action.type) {
        case ON_SUCCESS_SIGN_IN:
            return {...action.payload, isAuthenticated : true };
        case ON_SUCCESS_SIGN_OUT:
            return {...action.payload, isAuthenticated : false};
        default :
            return state;
    }
}

const UserContextProvider = props => {
    const [state, dispatch] = React.useReducer(userReducer, initialState.user);
    const signInHandler = function (user) {
        console.log("signInHandler")
        dispatch({
            type: ON_SUCCESS_SIGN_IN,
            payload: {
                profile : user ,
                name : user
            }
        });
    }
    const signOutHandler = function (user) {
        console.log("signOutHandler")
        dispatch({
            type: ON_SUCCESS_SIGN_OUT,
            payload: {
                profile : '' ,
                name : ''
            }
        });
    }

    return (
        <UserContext.Provider value={{
            ...state ,
            signInHandler:signInHandler,
            signOutHandler:signOutHandler}
        } >
            {props.children}
        </UserContext.Provider>
    );
};

export function useLoginHandler(){
    const contextValue = React.useContext(UserContext);
    return contextValue.signInHandler;
}
export function useLogoutHandler(){
    const contextValue = React.useContext(UserContext);
    return contextValue.signOutHandler;
}
export function useAuthenticated(){
    const contextValue = React.useContext(UserContext);
    return contextValue;
}

export default UserContextProvider;