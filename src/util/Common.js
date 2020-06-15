import axios from 'axios';
import { call, put } from 'redux-saga/effects';

function isNil(o){
    if (o===null||o===undefined){
        return true;
    }else{
        return false;
    }

}

export function* getRequest(config) {
    const { url, onSuccess, onError } = config;
    try {
        const response = yield call(axios.get, url);
        if (response && !isNil(response.data)) {
            yield put({ type: onSuccess, payload: response.data });
        } else {
            throw response;
        }
    } catch (error) {
        yield put({ type: onError, error });
    }
}

export function* postRequest(config) {
    const { url, data, onSuccess, onError } = config;
    try {
        const response = yield call(axios.post, url, data);
        if (response && !isNil(response.data)) {
            yield put({ type: onSuccess, payload: response.data });
        } else {
            throw response;
        }
    } catch (error) {
        yield put({ type: onError, error });
    }
}

export function* putRequest(config) {
    const { url, data, onSuccess, onError } = config;
    try {
        const response = yield call(axios.put, url, data);
        if (response && !isNil(response.data)) {
            yield put({ type: onSuccess, payload: response.data });
        } else {
            throw response;
        }
    } catch (error) {
        yield put({ type: onError, error });
    }
}
