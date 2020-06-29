import {GET} from "../../platform/util/Client"
import {take, all, put, select, delay,call ,race} from 'redux-saga/effects';
import {START_SUBSCRIBE,STOP_SUBSCRIBE,FIND_CHANGE} from "../module/EnvironmentModule";
import {STATUS_CREATING,STATUS_OK,STATUS_CHANGE_SETTING,STATUS_CHANGE_SET,STATUS_MOD_ING} from "../../common/CommonConst"
const baseEndPoint = process.env.REACT_APP_DEV_API_URL;

const target = [
    {prev : STATUS_CREATING , after : STATUS_OK},
    {prev : STATUS_CHANGE_SETTING , after : STATUS_CHANGE_SET},
    {prev : STATUS_MOD_ING , after : STATUS_OK},
]

export function* worker(action){
    const targetId      = action.env.id;
    const envIndex      = action.envIndex;
    while (true){
        const flg = yield select(state => state.env.showFoundMessage);
        if(!flg){
            const response = yield call(GET , baseEndPoint + "/env/" + targetId);
            const now = response.data;
            const prev = yield select(state => state.env.environments[envIndex]);
            if(now.status!==prev.status) {
                const match = target.find( t => ( t.prev===prev.status&&t.after===now.status ) )
                if(match!==undefined&&match!==null){
                    yield put(
                        { type: FIND_CHANGE,payload : now}
                    );
                }else{
                    console.log("[対象外]now.status:" + now.status);
                    console.log("[対象外]prev.status:" + prev.status);
                }
            }
        }
        yield delay(1000);
    }
}


export function* observer(){
    while (true){
        const action = yield take(START_SUBSCRIBE);
        yield race([call(worker,action),take(STOP_SUBSCRIBE)]);
    }
}


export default function* main() {
    return yield all([
        call(observer),
    ]);
}
