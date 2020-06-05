import { select, put, delay, takeLatest, all } from 'redux-saga/effects';
import { get } from '../../util/Common';
import {JOB_UPDATE,ON_SUCCESS_GET_STATUS,GET_STATUS} from "../../NavigationModule";

export function* getStatus() {
    yield get({
        url: `https://9l7wsipahj.execute-api.ap-northeast-1.amazonaws.com/operation`,
        onSuccess: ON_SUCCESS_GET_STATUS,
        onError: "ON_ERROR",
    });
}

export function* isComplete(action) {
    const prev = yield select(state => state.navigationReducer.targetOperations);
    const now  = action.payload;

    if(prev.length!==now.length){//もう少し丁寧に比較するようにいずれ修正
        yield put({
            type : JOB_UPDATE,
            payload : action.payload
        })
    }

    yield delay(20000);
    return yield put({
        type : GET_STATUS,
        payload : action.payload
    })
}

export default function* main(action) {
    return yield all([
        takeLatest(GET_STATUS, getStatus),
        takeLatest(ON_SUCCESS_GET_STATUS, isComplete),
    ]);
}

