import converter from "../../convert/ToCloudFormation";
import axios from "axios";
import {put} from "redux-saga/effects";
import {INVOKE_OPERATION_STARTED, ON_SUCCESS_GET_CHANGE_SET} from "../module/EnvironmentModule";

function* handleInvokeOperation(action) {
    const tenant = action.tenant;
    const envIndex = action.envIndex;
    const env    = action.env;
    const resource = env.resources;
    const stackName = resource.name;
    const template = converter.convert(resource);

    const res = yield axios.post(`https://9l7wsipahj.execute-api.ap-northeast-1.amazonaws.com/operate`,
        {
            command   : "create",
            env    : env,
            tenant    : tenant,
            envIndex  : envIndex,
            stackName : stackName,
            template  : template,
        });
    yield put({
        type: INVOKE_OPERATION_STARTED,
        tenant      : res.data.tenant,
        env    : res.data.env,
        envIndex  : envIndex,
        stackName : stackName,
        template  : template,
    });
}

export function* getChangeSet(action){
    const envIndex  = action.envIndex;
    const env       = action.env;
    const stackName = env.stack.name;
    const resource  = env.resources;
    const template  = converter.convert(resource);

    const res = yield axios.put(`https://9l7wsipahj.execute-api.ap-northeast-1.amazonaws.com/operate`,
        {
            command   : "changeSet",
            env    : env,
            envIndex  : envIndex,
            stackName : stackName,
            template  : template,
        });
    yield put({
        type: ON_SUCCESS_GET_CHANGE_SET,
        env    : res.data.env,
        envIndex  : envIndex,
        stackName : stackName,
        template  : template,
    });

}

export default handleInvokeOperation;

