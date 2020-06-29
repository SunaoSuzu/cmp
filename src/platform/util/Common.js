import axios from 'axios';
import { call, put } from 'redux-saga/effects';

export function isNil(o){
    if (o===null||o===undefined){
        return true;
    }else{
        return false;
    }

}

function getHeader() {
    return {headers: {'Content-Type': 'application/json'}};
}

export function getHeaderWithAuth(token) {
    return {headers: {"Authorization":token,'Content-Type': 'application/json'}};
}

export function* getRequest(config) {
    const { url,token, onSuccess, onError } = config;
    const httpHeader = isNil(token) ?  getHeader() :getHeaderWithAuth(token);
    try {
        const response = yield call(axios.get, url,httpHeader);
        if (response && !isNil(response.data)) {
            yield put({ type: onSuccess, payload: response.data });
        } else {
            throw response;
        }
    } catch (error) {
        if(isNil(onError)) {
            throw error
        }else{
            yield put({ type: onError, error })
        };
    }
}

export function* postRequest(config) {
    const { url, data, token ,onSuccess, onError } = config;
    try {
        const httpHeader = isNil(token) ?  getHeader() :getHeaderWithAuth(token);
        const response = yield call(axios.post, url, data,httpHeader);
        if (response && !isNil(response.data)) {
            yield put({ type: onSuccess, payload: response.data });
        } else {
            throw response;
        }
    } catch (error) {
        if(isNil(onError)) {
            throw error
        }else{
            yield put({ type: onError, error })
        };
    }
}

export function* putRequest(config) {
    const { url, data, token, onSuccess, onError } = config;
    const httpHeader = isNil(token) ?  getHeader() :getHeaderWithAuth(token);
    try {
        const response = yield call(axios.put, url, data,httpHeader);
        if (response && !isNil(response.data)) {
            yield put({ type: onSuccess, payload: response.data });
        } else {
            throw response;
        }
    } catch (error) {
        if(isNil(onError)) {
            throw error
        }else{
            yield put({ type: onError, error })
        };
    }
}
