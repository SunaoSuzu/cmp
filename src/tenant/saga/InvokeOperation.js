import converter from "../../convert/ToCloudFormation";
import axios from "axios";
import {put} from "redux-saga/effects";
import * as TenantAppModule from "../module/TenantAppModule";

function* handleInvokeOperation(action) {
    const envIndex = action.envIndex;
    const env    = action.env;
    const resource = env.resources;
    const tenant = action.tenant;
    const stackName = resource.name;
    const template = converter.convert(resource);

    const res = yield axios.post(`https://9l7wsipahj.execute-api.ap-northeast-1.amazonaws.com/operate`,
        {
            command   : "create",
            tenant    : tenant,
            envIndex  : envIndex,
            stackName : stackName,
            template  : template,
        });
    console.log("開始完了");
    yield put({
        type: TenantAppModule.INVOKE_OPERATION_STARTED,
        tenant      : res.data,
        envIndex  : envIndex,
        stackName : stackName,
        template  : template,
    });
}
export default handleInvokeOperation;

