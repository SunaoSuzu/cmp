import { put, all,takeLatest } from "redux-saga/effects";
import * as TenantAppModule from "../module/TenantAppModule";
import makeOperation from "../logic/OperationTemplateMaker";
import handleInvokeOperation from "./InvokeOperation";
import * as list from "./SearchOperation";
import * as table from "./TableOperation"
import {GET_LIST_REQUEST} from "../module/ListModule";
import {ADD_REQUEST} from "../module/AddNewModule";
import {
  NEW_ENV_REQUEST,
  GET_OPERATION_REQUEST,
  INVOKE_OPERATION_REQUEST,
  GET_OPERATION_SUCCESS,
  RESET_OPERATION_REQUEST
} from "../module/EnvironmentModule";

function* handleRequestGetOperation(action) {
  const tenant = action.tenant;
  const env = action.env;
  const envIndex = action.envIndex;
  let { resources, operations } = makeOperation(tenant, env);
  yield put({
    type       : GET_OPERATION_SUCCESS,
    resources  : resources,
    operations : operations,
    env        : env,
    envIndex   : envIndex,
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
    yield takeLatest(GET_OPERATION_REQUEST, handleRequestGetOperation),
    yield takeLatest(INVOKE_OPERATION_REQUEST, handleInvokeOperation),
    yield takeLatest(GET_OPERATION_SUCCESS, table.updateEnv),
    yield takeLatest(RESET_OPERATION_REQUEST, table.updateEnv)
  );
}

export default mySaga;
