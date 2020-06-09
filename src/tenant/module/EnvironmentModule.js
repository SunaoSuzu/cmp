import {GET_DETAIL_SUCCESS,} from "./TenantAppModule";
import * as CommonCost from "../../common/CommonConst";
import {setProperty} from "../../util/JsonUtils";

export const NEW_ENV_REQUEST = "NEW_ENV_REQUEST";
export const NEW_ENV_SUCCESS = "NEW_ENV_SUCCESS";
export const CHANGE_PROPERTY_ENV = "CHANGE_PROPERTY_ENV";

export const GET_OPERATION_REQUEST = "GET_OPERATION_REQUEST";
export const GET_OPERATION_SUCCESS = "GET_OPERATION_SUCCESS";
export const GET_OPERATION_FAIL = "GET_OPERATION_FAIL";

export const INVOKE_OPERATION_REQUEST = "INVOKE_OPERATION_REQUEST";
export const INVOKE_OPERATION_STARTED = "INVOKE_OPERATION_STARTED";
export const INVOKE_OPERATION_FAIL = "INVOKE_OPERATION_FAIL";

export const RESET_OPERATION_REQUEST = "RESET_OPERATION_REQUEST";

export const UPDATE_ENV_SUCCESS = "UPDATE_ENV_SUCCESS";
export const UPDATE_ENV_FAIL = "UPDATE_ENV_FAIL";

const initialState = {
    environments: [],
}
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_DETAIL_SUCCESS:
            return {...state, environments: action.environments};
        case NEW_ENV_REQUEST:
            return { ...state };
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
        case GET_OPERATION_REQUEST:
            return { ...state};
        case GET_OPERATION_SUCCESS: {
            const envs = [ ...state.environments ];
            const env = {...envs[action.envIndex]};
            env["resources"] = action.resources;
            env["operations"] = action.operations;
            env.status=CommonCost.STATUS_PLANED;
            envs[action.envIndex]=env;
            return {...state, environments: envs };
        }
        case GET_OPERATION_FAIL:
            return { ...state};
        case UPDATE_ENV_SUCCESS:
            const envs = [ ...state.environments ];
            envs[action.envIndex]=action.environment;
            return { ...state,environments: envs};
        case UPDATE_ENV_FAIL:
            return { ...state};
        case INVOKE_OPERATION_REQUEST:
            return { ...state, blocking: true };
        case INVOKE_OPERATION_STARTED:
            return { ...state, blocking: false};
        case INVOKE_OPERATION_FAIL:
            return { ...state, blocking: false };
        case RESET_OPERATION_REQUEST: {
            const envs = [ ...state.environments ];
            const env = {...envs[action.envIndex]};
            delete env.operations;
            delete env.resources;
            delete env.stack;
            env.status = CommonCost.STATUS_DRAFT;
            envs[action.envIndex]=env;
            return { ...state ,environments: envs};
        }
        default:
            return state;
    }
}

export const requestGetOperation = (tenant, env, envIndex) => {
    return {
        type: GET_OPERATION_REQUEST,
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

export const requestInvokeOperation = (tenant, env, envIndex , apiKey , apiPwd) => {
    return {
        type: INVOKE_OPERATION_REQUEST,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
        apiKey : apiKey,
        apiPwd : apiPwd,
    };
};

export const requestResetOperation = (tenant, env, envIndex) => {
    return {
        type: RESET_OPERATION_REQUEST,
        tenant: tenant,
        env: env,
        envIndex: envIndex,
    };
};
