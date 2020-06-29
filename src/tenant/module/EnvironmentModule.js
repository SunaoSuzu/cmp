import {GET_DETAIL_SUCCESS, UPDATE_SUCCESS,} from "./TenantAppModule";
import * as CommonCost from "../../common/CommonConst";
import {setProperty} from "../../platform/util/JsonUtils";

export const NEW_ENV_REQUEST = "NEW_ENV_REQUEST";
export const NEW_ENV_SUCCESS = "NEW_ENV_SUCCESS";
export const CHANGE_PROPERTY_ENV = "CHANGE_PROPERTY_ENV";

export const GET_OPERATION_REQUEST = "GET_OPERATION_REQUEST";
export const GET_OPERATION_SUCCESS = "GET_OPERATION_SUCCESS";

export const INVOKE_OPERATION_REQUEST = "INVOKE_OPERATION_REQUEST";
export const INVOKE_OPERATION_STARTED = "INVOKE_OPERATION_STARTED";

export const RESET_OPERATION_REQUEST = "RESET_OPERATION_REQUEST";
export const RESET_UPD_OPERATION_REQUEST = "RESET_UPD_OPERATION_REQUEST";

export const UPDATE_ENV_SUCCESS = "UPDATE_ENV_SUCCESS";

export const GET_UPD_OPERATION_REQUEST = "GET_UPD_OPERATION_REQUEST";
export const GET_UPD_OPERATION_SUCCESS = "GET_UPD_OPERATION_SUCCESS";

export const GET_CHANGE_SET = "GET_CHANGE_SET";
export const ON_SUCCESS_GET_CHANGE_SET = "ON_SUCCESS_GET_CHANGE_SET";

export const EXECUTE_CHANGE_SET = "EXECUTE_CHANGE_SET";
export const ON_SUCCESS_EXECUTE_CHANGE_SET = "ON_SUCCESS_EXECUTE_CHANGE_SET";

export const START_SUBSCRIBE = "START_SUBSCRIBE";
export const STOP_SUBSCRIBE  = "STOP_SUBSCRIBE";
export const FIND_CHANGE     = "FIND_CHANGE";
export const ACCEPT_CHANGE   = "ACCEPT_CHANGE";
export const CANCEL_CHANGE   = "CANCEL_CHANGE";


const initialState = {
    showFoundMessage : false,
    environments: [],
    found : null,
}
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_DETAIL_SUCCESS:
            return {...state, environments: action.environments};
        case NEW_ENV_SUCCESS: {
            return { ...state,environments : state.environments.concat(action.environment)};
        }
        case CHANGE_PROPERTY_ENV:{
            const envs = [ ...state.environments ];
            const env = {...envs[action.envIndex]};
            setProperty(env, action.name, action.value);
            envs[action.envIndex]=env;
            return { ...state, environments: envs }
        }
        case UPDATE_SUCCESS:    //tenant update
            return {...state, environments: action.envs};
        case GET_OPERATION_SUCCESS: {
            const envs = [ ...state.environments ];
            const env = {...envs[action.envIndex]};
            env.stack = {name : action.stackName , template : action.template , status:0};
            env.resources = action.resources;
            env.status=CommonCost.STATUS_PLANED;
            envs[action.envIndex]=env;
            return {...state, environments: envs };
        }
        case GET_UPD_OPERATION_SUCCESS :{
            const envs = [ ...state.environments ];
            const env = {...envs[action.envIndex]};
            env.prev = {stack : env.stack , resources : env.resources}
            env.stack.template = action.template;
            env.resources = action.resources;
            env.status=CommonCost.STATUS_MOD_PLANED;
            envs[action.envIndex]=env;
            return {...state, environments: envs };
        }
        case UPDATE_ENV_SUCCESS:
        case INVOKE_OPERATION_STARTED:
        case ON_SUCCESS_EXECUTE_CHANGE_SET:
        case ON_SUCCESS_GET_CHANGE_SET:
        {
            const envs = [ ...state.environments ];
            envs[action.envIndex]=action.env;
            return { ...state, environments: envs };
        }
        case RESET_OPERATION_REQUEST: {
            const envs = [ ...state.environments ];
            const env = {...envs[action.envIndex]};
            delete env.resources;
            delete env.stack;
            env.status = CommonCost.STATUS_DRAFT;
            envs[action.envIndex]=env;
            return { ...state ,environments: envs};
        }
        case RESET_UPD_OPERATION_REQUEST: {
            const envs = [ ...state.environments ];
            const env = {...envs[action.envIndex]};
            env.resources=env.prev.resources;
            env.stack=env.prev.stack;
            delete env.prev;
            env.status = CommonCost.STATUS_OK;
            envs[action.envIndex]=env;
            return { ...state ,environments: envs};
        }
        case FIND_CHANGE:{
            return {...state,showFoundMessage : true , found : action.payload};
        }
        case ACCEPT_CHANGE:{
            const envs = [ ...state.environments ];
            envs[action.envIndex]=state.found;
            return { ...state, environments: envs,showFoundMessage : false,found:null };
        }
        case STOP_SUBSCRIBE:
        case START_SUBSCRIBE:
            return {...state , showFoundMessage : false,found:null}
        default:
            return state;
    }
}

export const getOperation = (tenant, env, envIndex) => {
    return {
        type: GET_OPERATION_REQUEST,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};

export const getUpdOperation = (tenant, env, envIndex) => {
    return {
        type: GET_UPD_OPERATION_REQUEST,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};

export const requestNewEnv = (tenant) => {
    return {
        type: NEW_ENV_REQUEST,
        tenant: tenant,
    };
};

export const changeEnvProperty = (e,envIndex) => {
    return {
        type: CHANGE_PROPERTY_ENV,
        envIndex: envIndex,
        name: e.target.name,
        value: e.target.value,
    };
};

export const invokeOperation = (tenant, env, envIndex ) => {
    return {
        type: INVOKE_OPERATION_REQUEST,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};

export const getChangeSet = (tenant, env, envIndex ) => {
    return {
        type: GET_CHANGE_SET,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};

export const executeChangeSet = (tenant, env, envIndex ) => {
    return {
        type: EXECUTE_CHANGE_SET,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};

export const resetOperation = (tenant, env, envIndex) => {
    return {
        type: RESET_OPERATION_REQUEST,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};

export const resetUpdOperation = (tenant, env, envIndex) => {
    return {
        type: RESET_UPD_OPERATION_REQUEST,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};

export const startSubscribe = (tenant, env, envIndex) => {
    return {
        type: START_SUBSCRIBE,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};

export const stopSubscribe = (tenant, env, envIndex) => {
    return {
        type: STOP_SUBSCRIBE,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};

export const acceptChange = (tenant, env, envIndex) => {
    return {
        type: ACCEPT_CHANGE,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};
