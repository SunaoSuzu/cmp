import { put, takeEvery, all } from "redux-saga/effects";
import * as TenantAppModule from "../TenantAppModule";
import makeEnvironment from "../EnvironmentTemplateMaker";
import * as AwsAppSaga from "../../aws/AwsAppSaga";
import makeOperation from "../OperationTemplateMaker";
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
}


function* mySaga() {
  all(
    yield takeEvery(TenantAppModule.GET_LIST_REQUEST, handleRequestList),
    yield takeEvery(TenantAppModule.GET_DETAIL_REQUEST, table.handleRequestData),
    yield takeEvery(TenantAppModule.UPDATE_REQUEST, table.handleRequestUpdate),
    yield takeEvery(TenantAppModule.ADD_REQUEST, table.handleRequestAdd),
    yield takeEvery(TenantAppModule.DEL_REQUEST, table.handleRequestDel),
    yield takeEvery(TenantAppModule.NEW_ENV_REQUEST, handleRequestNewEnv),
    yield takeEvery(
      TenantAppModule.GET_OPERATION_REQUEST,
      handleRequestGetOperation
    ),
    yield takeEvery(
      TenantAppModule.ATTACH_AWS_REQUEST,
      AwsAppSaga.handleAttachByTag
    ),
    yield takeEvery(
      TenantAppModule.INVOKE_OPERATION_REQUEST,
      handleInvokeOperation
    )
  );
}

export default mySaga;
