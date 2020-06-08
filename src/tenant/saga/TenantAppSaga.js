import { put, all,takeLatest } from "redux-saga/effects";
import * as TenantAppModule from "../module/TenantAppModule";
import * as AwsAppSaga from "../../aws/AwsAppSaga";
import makeOperation from "../logic/OperationTemplateMaker";
import handleInvokeOperation from "./InvokeOperation";
import * as list from "./SearchOperation";
import * as table from "./TenantTableOperation"
import {GET_LIST_REQUEST} from "../module/ListModule";
import {ADD_REQUEST} from "../module/AddNewModule";
import {NEW_ENV_REQUEST,NEW_ENV_SUCCESS} from "../module/EnvironmentModule";





function* handleRequestGetOperation(action) {
  const tenant = action.tenant;
  const env = action.env;
  const envIndex = action.envIndex;
  let { resources, operations } = makeOperation(tenant, env);
  yield put({
    type: TenantAppModule.GET_OPERATION_SUCCESS,
    resources: resources,
    operations: operations,
    envIndex: envIndex,
  });
  yield put({
    type: TenantAppModule.UPDATE_REQUEST,
    tenant: tenant,
  });
}


function* mySaga() {
  all(
    yield takeLatest(GET_LIST_REQUEST, list.handleRequestList),
    yield takeLatest(TenantAppModule.GET_DETAIL_REQUEST, table.handleRequestData),
    yield takeLatest(TenantAppModule.UPDATE_REQUEST, table.handleRequestUpdate),
    yield takeLatest(ADD_REQUEST, table.handleRequestAdd),
    yield takeLatest(TenantAppModule.DEL_REQUEST, table.handleRequestDel),
    yield takeLatest(NEW_ENV_REQUEST, table.handleRequestNewEnv),
    yield takeLatest(TenantAppModule.GET_OPERATION_REQUEST, handleRequestGetOperation),
    yield takeLatest(TenantAppModule.ATTACH_AWS_REQUEST, AwsAppSaga.handleAttachByTag),
    yield takeLatest(TenantAppModule.INVOKE_OPERATION_REQUEST, handleInvokeOperation)
  );
}

export default mySaga;
