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
    const prev = yield select(state => state.targetOperations);
    const now  = action.payload;

    if(prev.length!==now.length){
        //いずれなんか目立つ処理をいれる（もう少ししっかり比較する必要もある）
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

