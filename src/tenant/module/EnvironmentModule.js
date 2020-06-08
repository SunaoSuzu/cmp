import {GET_DETAIL_SUCCESS, synced, syncing, yet} from "./TenantAppModule";

export const NEW_ENV_REQUEST = "NEW_ENV_REQUEST";
export const NEW_ENV_SUCCESS = "NEW_ENV_SUCCESS";

const initialState = {
    environments: [],
    newEnvCompleted: yet,

}
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_DETAIL_SUCCESS:
            return {environments: action.environments};
        case NEW_ENV_REQUEST:
            return { ...state, newEnvCompleted: syncing };
        case NEW_ENV_SUCCESS: {
            return { environments : state.environments.concat(action.environment) , newEnvCompleted: synced,  };
        }
        default:
            return state;
    }
}

export const requestNewEnv = (tenant) => {
    return {
        type: NEW_ENV_REQUEST,
        tenant: tenant,
    };
};

