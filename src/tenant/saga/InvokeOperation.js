import converter from "../../convert/ToCloudFormation";
import axios from "axios";
import {put} from "redux-saga/effects";
import * as TenantAppModule from "../TenantAppModule";

function* handleInvokeOperation(action) {
    const envIndex = action.envIndex;
    const env    = action.env;
    const resource = env.resources;
    const data = action.tenant;
    const stackName = resource.name;
    const template = converter.convert(resource);
    env.status = 10;

    const res = yield axios.post(`https://9l7wsipahj.execute-api.ap-northeast-1.amazonaws.com/operate`,
        {
            command   : "create",
            tenant    : data,
            envIndex  : envIndex,
            stackName : stackName,
            template  : template,
        });
    console.log("開始完了");
    yield put({
        type: TenantAppModule.INVOKE_OPERATION_STARTED,
        data      : res.data,
        envIndex  : envIndex,
        stackName : stackName,
        template  : template,
    });
}
export default handleInvokeOperation;

