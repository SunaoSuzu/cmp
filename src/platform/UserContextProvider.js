/**
 * 利用者毎の情報を管理するグローバルContext
 **/
import React from "react"
import * as auth from './Auth'
import * as ConfigLoader from './Config'

const UserContext = React.createContext();

const initialState = {
    user: {
        isForcePwdChg  : false,
        message : null,
    },
    config : {
        menuIcons  : [],
        reportIcons : [],
        menuOptions : {},
    },
};

const userReducer = (state, action) => {
    switch (action.type) {
        case auth.ON_SUCCESS_SIGN_IN:
            return {...action.payload, message : null , isForcePwdChg:false};
        case auth.FAIL_SIGN_IN:
            return {...action.payload, isForcePwdChg:false};
        case auth.FAIL_PWD_CHALLENGE:
            return {...action.payload, isForcePwdChg:true};
        case auth.FORCE_PWD_CHG:
            return {...action.payload, message : null ,isForcePwdChg:true};
        case auth.ON_SUCCESS_SIGN_OUT:
            return {...action.payload, message : null ,isForcePwdChg:false};
        default :
            return state;
    }
}

const configReducer = (state, action) => {
    switch (action.type) {
        case auth.ON_SUCCESS_SIGN_IN:
            return {...action.payload};
        case auth.ON_SUCCESS_SIGN_OUT:
            return {menuIcons  : [] , menuOptions : {},reportIcons :[]};
        default :
            return state;
    }
}


const UserContextProvider = props => {
    const [state, dispatch] = React.useReducer(userReducer, initialState.user);
    const [config, dispatchConfig] = React.useReducer(configReducer, initialState.config);
    const configHandler = async function () {
        await ConfigLoader.load().then( result => {
            dispatchConfig({
                type: auth.ON_SUCCESS_SIGN_IN,
                payload : result ,
            })
        });
    }

    const signInHandler = async function (user,password) {
        await auth.doLogin(user,password).then( (result) => {
            dispatch({
                type: result.type,
                payload: {
                    ...result.payload,
                    profile : user ,
                    name : user,
                }
            });
        })
    }
    const pwdChgHandler = async function (user,nowPwd,name,newPwd) {
        await auth.completeNewPasswordChallenge(user,nowPwd,name,newPwd).then( (result) => {
                dispatch({
                    type: result.type,
                    payload: {
                        ...result.payload,
                        profile : user ,
                        name : user,
                    }
                });
            }
        )
    }
    const signOutHandler = function () {
        auth.doLogout();
        dispatchConfig({
            type: auth.ON_SUCCESS_SIGN_OUT,
            payload: {}
        });
        dispatch({
            type: auth.ON_SUCCESS_SIGN_OUT,
            payload: {
                token   : '' ,
                profile : '' ,
                name    : ''
            }
        });
    }

    return (
        <UserContext.Provider value={{
            ...state ,
            user : {...state},
            config : {...config},
            signInHandler:signInHandler,
            signOutHandler:signOutHandler,
            pwdChgHandler : pwdChgHandler,
            configHandler:configHandler
            }
        } >
            {props.children}
        </UserContext.Provider>
    );
};

export function useConfigHandler(){
    const contextValue = React.useContext(UserContext);
    return contextValue.configHandler;
}

export function useLoginHandler(){
    const contextValue = React.useContext(UserContext);
    return contextValue.signInHandler;
}
export function useLogoutHandler(){
    const contextValue = React.useContext(UserContext);
    return contextValue.signOutHandler;
}
export function usePwdChgHandler(){
    const contextValue = React.useContext(UserContext);
    return contextValue.pwdChgHandler;
}
/**
 * 将来削除したい
 * */
export function useAuthenticateInfo(){
    const contextValue = React.useContext(UserContext);
    return contextValue.user;
}

export function useIdToken(){
    return auth.getToken();
}

export function useMenuIcons(){
    const contextValue = React.useContext(UserContext);
    return contextValue.config.menuIcons;
}
export function useReportIcons(){
    const contextValue = React.useContext(UserContext);
    return contextValue.config.reportIcons;
}


export function useMenuOption(id){
    const contextValue = React.useContext(UserContext);
    return contextValue.config.menuOptions[id];
}


export function useIsAuthenticated(){
    return auth.isAuthenticated();
}

export default UserContextProvider;