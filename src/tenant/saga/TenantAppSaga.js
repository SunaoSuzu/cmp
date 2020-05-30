import { put, all,takeLatest } from "redux-saga/effects";
import * as TenantAppModule from "../TenantAppModule";
import makeEnvironment from "../logic/EnvironmentTemplateMaker";
import * as AwsAppSaga from "../../aws/AwsAppSaga";
import makeOperation from "../logic/OperationTemplateMaker";
import handleInvokeOperation from "./InvokeOperation";
import handleRequestList from "./SearchOperation";
import * as table from "./TenantTableOperation"


function* handleRequestNewEnv(action) {
  const tenant = action.data;
  let ret = makeEnvironment(tenant);
  yield put({
    type: TenantAppModule.NEW_ENV_SUCCESS,
    environment: ret,
  });
  yield put({
    type: TenantAppModule.UPDATE_REQUEST,
    data: tenant,
  });
}

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
    data: tenant,
  });
}


function* mySaga() {
  all(
    yield takeLatest(TenantAppModule.GET_LIST_REQUEST, handleRequestList),
    yield takeLatest(TenantAppModule.GET_DETAIL_REQUEST, table.handleRequestData),
    yield takeLatest(TenantAppModule.UPDATE_REQUEST, table.handleRequestUpdate),
    yield takeLatest(TenantAppModule.ADD_REQUEST, table.handleRequestAdd),
    yield takeLatest(TenantAppModule.DEL_REQUEST, table.handleRequestDel),
    yield takeLatest(TenantAppModule.NEW_ENV_REQUEST, handleRequestNewEnv),
    yield takeLatest(TenantAppModule.GET_OPERATION_REQUEST, handleRequestGetOperation),
    yield takeLatest(TenantAppModule.ATTACH_AWS_REQUEST, AwsAppSaga.handleAttachByTag),
    yield takeLatest(TenantAppModule.INVOKE_OPERATION_REQUEST, handleInvokeOperation)
  );
}

export default mySaga;
