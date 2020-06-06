import { takeLatest, all } from 'redux-saga/effects';
import { get } from '../../util/Common';
import {ON_SUCCESS_GET_OPERATION,GET_OPERATION}  from "../OperationAppModule";

export function* getOperations(){
    yield get({
        url: `https://9l7wsipahj.execute-api.ap-northeast-1.amazonaws.com/operation`,
        onSuccess: ON_SUCCESS_GET_OPERATION,
        onError: "ON_ERROR",
    });

}
export default function* main(action) {
    return yield all([
        takeLatest(GET_OPERATION, getOperations),
    ]);
}
