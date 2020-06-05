import { select, put, delay, takeEvery, all } from 'redux-saga/effects';
import { get } from '../../util/Common';

export function* getStatus() {
    yield get({
        url: `https://9l7wsipahj.execute-api.ap-northeast-1.amazonaws.com/operation`,
        onSuccess: "ON_SUCCESS_GET_STATUS",
        onError: "ON_ERROR",
    });
}

export function* isComplete(action) {
    const prev = yield select(state => state.navigationReducer.targetOperations);
    const now  = action.payload;

    if(prev.length!==now.length){
        console.log("Job数に変更あり！！！！！！");
    }

    yield delay(20000);
    return yield put({
        type : "GET_STATUS",
        payload : action.payload
    })
}

export default function* main(action) {
    return yield all([
        takeEvery("GET_STATUS", getStatus),
        takeEvery("ON_SUCCESS_GET_STATUS", isComplete),
    ]);
}

