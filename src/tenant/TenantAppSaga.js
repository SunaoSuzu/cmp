import { put, takeEvery, all } from 'redux-saga/effects'
import * as TenantAppModule from "./TenantAppModule";
import axios from 'axios'
import makeTemplateMaker from "./EnvironmentTemplateMaker";



const baseEndPoint = process.env.REACT_APP_DEV_API_URL;


function* handleRequestList() {
    try {
        const res = yield axios.get(baseEndPoint + `/tenant`);
        yield put(
        {
            type: TenantAppModule.GET_LIST_SUCCESS,
            datas : res.data,
            receivedAt: Date.now()
            }
        );
    } catch (e) {
        yield put({
            type: TenantAppModule.GET_LIST_FAILURE,
            e
        });
    }
}
function* handleRequestData(action) {
    try {
        const id = action.id;
        const res = yield axios.get(baseEndPoint + `/tenant/` + id);
        yield put(
            {
                type: TenantAppModule.GET_DETAIL_SUCCESS,
                data : res.data,
                receivedAt: Date.now()
            }
        );
    } catch (e) {
        yield put({
            type: TenantAppModule.GET_DETAIL_FAILURE,
            e
        });
    }
}
function* handleRequestUpdate(action) {
    try {
        const data = action.data;
        let currentRevision = data["revision"];
        if(currentRevision===null){
            //for dirty data
            currentRevision=1;
        }
        data["revision"]=currentRevision+1;
        const res = yield axios.put(baseEndPoint + `/tenant/` + data.id , data)
        yield put(
            {
                type: TenantAppModule.UPDATE_SUCCESS,
                data : res.data,
                receivedAt: Date.now()
            }
        );
    } catch (e) {
        yield put({
            type: TenantAppModule.UPDATE_FAILURE,
            e
        });
    }
}
function* handleRequestAdd(action) {
    try {
        const data = action.data;
        data["revision"]=1;
        const res = yield axios.post(baseEndPoint + `/tenant` , data)
        yield put(
            {
                type: TenantAppModule.ADD_SUCCESS,
                data : res.data,
                receivedAt: Date.now()
            }
        );
    } catch (e) {
        yield put({
            type: TenantAppModule.ADD_FAILURE,
            e
        });
    }
}

function* handleRequestDel(action) {
    try {
        const id = action.id;
        const res = yield axios.delete(baseEndPoint + `/tenant/` + id);
        yield put(
            {
                type: TenantAppModule.DEL_SUCCESS,
                data : res.data,
                receivedAt: Date.now()
            }
        );
    } catch (e) {
        yield put({
            type: TenantAppModule.DEL_FAILURE,
            e
        });
    }
}

function* handleRequestNewEnv(action) {
    const tenant = action.data;
    let ret = makeTemplateMaker(tenant);
    sleep(500);
    yield put({
        type: TenantAppModule.NEW_ENV_SUCCESS,
        environment : ret,
    });
}


function* mySaga() {
    all(
        yield takeEvery(TenantAppModule.GET_LIST_REQUEST , handleRequestList),
        yield takeEvery(TenantAppModule.GET_DETAIL_REQUEST , handleRequestData),
        yield takeEvery(TenantAppModule.UPDATE_REQUEST , handleRequestUpdate),
        yield takeEvery(TenantAppModule.ADD_REQUEST , handleRequestAdd),
        yield takeEvery(TenantAppModule.DEL_REQUEST , handleRequestDel),
        yield takeEvery(TenantAppModule.NEW_ENV_REQUEST , handleRequestNewEnv),
    )
}

function sleep(waitMsec) {
    var startMsec = new Date();

    // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
    while (new Date() - startMsec < waitMsec){}
}

export default mySaga;