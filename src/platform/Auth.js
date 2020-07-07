import AWS from 'aws-sdk'
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')


export const SIGN_IN = "SIGN_IN";
export const ON_SUCCESS_SIGN_IN = "ON_SUCCESS_SIGN_IN";
export const FORCE_PWD_CHG = "FORCE_PWD_CHG";
export const MF_CHALLENGE = "MF_CHALLENGE";
export const CUSTOM_CHALLENGE = "CUSTOM_CHALLENGE";
export const FAIL_SIGN_IN = "FAIL_SIGN_IN";
export const FAIL_PWD_CHALLENGE = "FAIL_PWD_CHALLENGE";
export const ON_SUCCESS_SIGN_OUT = "ON_SUCCESS_SIGN_OUT";

export const cognitoConfig = {
    region: 'ap-northeast-1',
    IdentityPoolId: 'ap-northeast-1:57065cfe-8606-4b3d-afa6-ba4c124d46c0',
    UserPoolId: 'ap-northeast-1_OS8KTk9vJ',
    ClientId: '50r4are8coqeh38393gk2tassh',
}


function initPool() {
    const userPoolData = {
        UserPoolId : cognitoConfig.UserPoolId,
        ClientId : cognitoConfig.ClientId
    };
    return new AmazonCognitoIdentity.CognitoUserPool(userPoolData)

}

function getCurrentUser() {
    const userPool = initPool();
    return userPool.getCurrentUser()
}

export function getToken() {
    const cognitoUser = getCurrentUser()
    if(!cognitoUser) return null;
    let token = null
    cognitoUser.getSession( function (err, session) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        token = session.getIdToken().getJwtToken()
    })
    return token;
}

function prepare(userName){
    const userPool = initPool();
    const userData = {
        Username : userName,
        Pool : userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    return cognitoUser;
}

export const isAuthenticated = function () {
    const token = getToken();
    if (token) {
        return true;
    } else {
        return false;
    }
}


export const doLogout = function () {
    const cognitoUser = getCurrentUser()
    if (cognitoUser) {
        cognitoUser.signOut()
        localStorage.clear()
        console.log('signed out')
    } else {
        localStorage.clear()
        console.log('no user signing in')
    }
}


export const doLogin = function (userName, password) {
    return challengeImpl(userName, password , null,null)
}

const challengeImpl = function (userName , password , name , newPassword) {
    const onlyAuth = (newPassword!==undefined&&newPassword!==null) ? false : true;
    return new Promise(function(resolve, reject){
        let cognitoUser = prepare(userName);

        let authenticationData = {
            Username : userName,
            Password : password
        };
        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)
        cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH')

        cognitoUser.authenticateUser(authenticationDetails,{
            onSuccess: function (result) {
                const logins  = {}
                logins["cognito-idp." + cognitoConfig.region + ".amazonaws.com/" + cognitoConfig.UserPoolId]=result.getIdToken().getJwtToken()
                AWS.config.region = cognitoConfig.region
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: cognitoConfig.IdentityPoolId,
                    Logins : logins
                });
                AWS.config.credentials.refresh((error) => {
                    if (error) {
                        console.log("refresh:error!:" + error);
                        resolve({type : FAIL_SIGN_IN, payload: {message : (JSON.stringify(result))}})
                    } else {
                        resolve({type : ON_SUCCESS_SIGN_IN,payload : {token : result.getIdToken().getJwtToken()}})
                    }
                });
            },
            onFailure: function (err) {
                console.log("onFailure!");
                if(onlyAuth) {
                    resolve({type : FAIL_SIGN_IN, payload: {message : (err.message || JSON.stringify(err))}})
                }else{
                    resolve({type : FAIL_PWD_CHALLENGE, payload: {message : (err.message || JSON.stringify(err))}})
                }
            },
            mfaRequired: function(result) {
                resolve({type : MF_CHALLENGE, payload: {}})
            },
            newPasswordRequired(result) {
                if(!onlyAuth){
                    cognitoUser.completeNewPasswordChallenge(newPassword, {name : name} , this)
                }else{
                    resolve({type : FORCE_PWD_CHG, payload: {}})
                }
            },
            customChallenge(result) {
                resolve({type : CUSTOM_CHALLENGE, payload: {}})
            }
        })
    })
}

export const completeNewPasswordChallenge = function(user , currentPassword ,name, password) {
    return challengeImpl(user , currentPassword ,name, password);
}