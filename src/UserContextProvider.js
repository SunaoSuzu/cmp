/**
 * 利用者毎の情報を管理するグローバルContext
 **/
import React from "react"
import * as auth from './signin/Auth'

const UserContext = React.createContext();

const initialState = {
    user: {
        isForcePwdChg  : false,
        message : null,
        token  : null,
        profile: null,
        name   : null,
    }
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

const UserContextProvider = props => {
    const [state, dispatch] = React.useReducer(userReducer, initialState.user);
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
            }
        )
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
            signInHandler:signInHandler,
            signOutHandler:signOutHandler,
            pwdChgHandler : pwdChgHandler,
            }
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
export function usePwdChgHandler(){
    const contextValue = React.useContext(UserContext);
    return contextValue.pwdChgHandler;
}
/**
 * 将来削除したい
 * */
export function useAuthenticateInfo(){
    const contextValue = React.useContext(UserContext);
    return contextValue;
}

export function useIdToken(){
    return auth.getToken();
}


export function useIsAuthenticated(){
    return auth.isAuthenticated();
}

export default UserContextProvider;