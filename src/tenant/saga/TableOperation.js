import axios from "axios";
import {put,select} from "redux-saga/effects";
import * as TenantAppModule from "../module/TenantAppModule";
import {ADD_SUCCESS } from "../module/AddNewModule";
import makeEnvironment from "../logic/EnvironmentTemplateMaker";
import {NEW_ENV_SUCCESS,UPDATE_ENV_SUCCESS} from "../module/EnvironmentModule";
import {ERROR} from "../module/TenantAppModule";


const baseEndPoint = process.env.REACT_APP_DEV_API_URL;
export function* handleRequestData(action) {
    try {
        const id = action.id;
        const res = yield axios.get(baseEndPoint + `/tenant/` + id);
        yield put({
            type: TenantAppModule.GET_DETAIL_SUCCESS,
            tenant: res.data.tenant,
            environments : res.data.environments,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: ERROR,
            e,
        });
    }
}
export function* handleRequestUpdate(action) {
    try {
        const tenant = action.tenant;
        const envs   = action.envs;
        const res = yield axios.put(baseEndPoint + `/tenant/` + tenant.id, {tenant : tenant , envs : envs});
        yield put({
            type: TenantAppModule.UPDATE_SUCCESS,
            tenant: res.data.tenant,
            envs: res.data.envs,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: ERROR,
            e,
        });
    }
}


export function* handleRequestAdd(action) {
    try {
        const tenant = action.tenant;
        const res = yield axios.post(baseEndPoint + `/tenant`, tenant);
        yield put({
            type: ADD_SUCCESS,
            tenant: res.data,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: ERROR,
            e,
        });
    }
}

export function* handleRequestDel(action) {
    try {
        const id = action.id;
        const res = yield axios.delete(baseEndPoint + `/tenant/` + id);
        yield put({
            type: TenantAppModule.DEL_SUCCESS,
            tenant: res.data,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: ERROR,
            e,
        });
    }
}

export function* handleRequestNewEnv(action) {
    let ret = makeEnvironment(action.tenant);

    const res = yield axios.post(baseEndPoint + `/env`, {tenant : action.tenant , env : ret});

    yield put({
        type: NEW_ENV_SUCCESS,
        tenant : res.data.tenant,
        environment: res.data.env,
    });
}

export function* updateEnv(action) {
    const envs = yield select( state => state.env.environments);
    const env = envs[action.envIndex];
    const res = yield axios.put(baseEndPoint + `/env/` + env.id, env);

    yield put({
        type: UPDATE_ENV_SUCCESS,
        envIndex : action.envIndex,
        env: res.data,
    });
}
