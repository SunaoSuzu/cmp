import { put, all,takeLatest,call } from "redux-saga/effects";
import * as TenantAppModule from "../module/TenantAppModule";
import makeOperation from "../logic/OperationTemplateMaker";
import handleInvokeOperation, {getChangeSet , execChangeSet} from "./InvokeOperation";
import * as list from "./SearchOperation";
import * as table from "./TableOperation"
import {GET_LIST_REQUEST} from "../module/ListModule";
import {ADD_REQUEST} from "../module/AddNewModule";
import {
  NEW_ENV_REQUEST,
  GET_CHANGE_SET,
  GET_OPERATION_REQUEST,
  INVOKE_OPERATION_REQUEST,
  GET_OPERATION_SUCCESS,
  RESET_OPERATION_REQUEST,
  GET_UPD_OPERATION_SUCCESS,
  GET_UPD_OPERATION_REQUEST,
  EXECUTE_CHANGE_SET,
  RESET_UPD_OPERATION_REQUEST,
  ON_SUCCESS_EXECUTE_CHANGE_SET,

} from "../module/EnvironmentModule";
import converter from "../../convert/ToCloudFormation";
import EnvStatusSubscribe from "./EnvStatusSubscribe";

function* getOperation(action) {
  const tenant = action.tenant;
  const env = action.env;
  const envIndex = action.envIndex;
  let { resources, operations } = makeOperation(tenant, env);
  const template = converter.convert(resources);
  const stackName = resources.name;
  yield put({
    type       : GET_OPERATION_SUCCESS,
    resources  : resources,
    operations : operations,
    template   : template,
    stackName : stackName,
    env        : env,
    envIndex   : envIndex,
  });
}

function* getUpdOperation(action) {
  const tenant = action.tenant;
  const env = action.env;
  const envIndex = action.envIndex;
  let { resources, operations } = makeOperation(tenant, env);
  const template = converter.convert(resources);

  yield put({
    type       : GET_UPD_OPERATION_SUCCESS,
    resources  : resources,
    operations : operations,
    template   : template,
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
    yield takeLatest(GET_OPERATION_REQUEST, getOperation),
    yield takeLatest(GET_UPD_OPERATION_REQUEST, getUpdOperation),
    yield takeLatest(INVOKE_OPERATION_REQUEST, handleInvokeOperation),
    yield takeLatest(GET_OPERATION_SUCCESS, table.updateEnv),
    yield takeLatest(RESET_OPERATION_REQUEST, table.updateEnv),
    yield takeLatest(GET_UPD_OPERATION_SUCCESS, table.updateEnv),
    yield takeLatest(RESET_UPD_OPERATION_REQUEST, table.updateEnv),
    yield takeLatest(GET_CHANGE_SET, getChangeSet),
    yield takeLatest(EXECUTE_CHANGE_SET, execChangeSet),
    yield call(EnvStatusSubscribe),
  );
}

export default mySaga;
