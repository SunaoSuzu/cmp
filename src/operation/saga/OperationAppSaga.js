import {GET} from "../../platform/util/Client"
import {take, all, put, select, delay,call ,race} from 'redux-saga/effects';
import {START_MONITORING,STOP_MONITORING,DATA_UPDATED}  from "../OperationAppModule";

const url = `https://9l7wsipahj.execute-api.ap-northeast-1.amazonaws.com/operation`;

export function* worker(){
    while (true){
        const response = yield call(GET , url);
        const now = response.data;
        if(now.length===0) {
            yield put(
                {type: DATA_UPDATED, payload: now}
            );
        }
        const prev = yield select(state => state.operations);
        if(prev.length!==now.length) {
            yield put(
                { type: DATA_UPDATED,payload : now}
            );
        }else{
            //statusのみ比較する
            const changed = prev.filter( pr => pr.jobStatus !== 10).some( p => {
                const n = now.find( n => n.jobId===p.jobId);
                if(n===null||n===undefined){
                    return true;
                }
                if(p.jobStatus!==n.jobStatus){
                    return true;
                }
            })
            if(changed){
                yield put(
                    { type: DATA_UPDATED,payload : now}
                );
            }
        }
        yield delay(3000);
    }
}

export function* observer(){
    while (true){
        yield take(START_MONITORING);
        yield race([call(worker),take(STOP_MONITORING)]);
    }
}


export default function* main() {
    return yield all([
        call(observer),
    ]);
}
