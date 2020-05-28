import axios from "axios";
import {put} from "redux-saga/effects";
import * as TenantAppModule from "../TenantAppModule";

const baseEndPoint = process.env.REACT_APP_DEV_API_URL;
export function* handleRequestData(action) {
    try {
        const id = action.id;
        const res = yield axios.get(baseEndPoint + `/tenant/` + id);
        yield put({
            type: TenantAppModule.GET_DETAIL_SUCCESS,
            data: res.data,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: TenantAppModule.GET_DETAIL_FAILURE,
            e,
        });
    }
}
export function* handleRequestUpdate(action) {
    try {
        const data = action.data;
        let currentRevision = data["revision"];
        if (currentRevision === null) {
            //for dirty data
            currentRevision = 1;
        }
        data["revision"] = currentRevision + 1;
        const res = yield axios.put(baseEndPoint + `/tenant/` + data.id, data);
        yield put({
            type: TenantAppModule.UPDATE_SUCCESS,
            data: res.data,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: TenantAppModule.UPDATE_FAILURE,
            e,
        });
    }
}
export function* handleRequestAdd(action) {
    try {
        const data = action.data;
        data["revision"] = 1;
        const res = yield axios.post(baseEndPoint + `/tenant`, data);
        yield put({
            type: TenantAppModule.ADD_SUCCESS,
            data: res.data,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: TenantAppModule.ADD_FAILURE,
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
            data: res.data,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: TenantAppModule.DEL_FAILURE,
            e,
        });
    }
}
