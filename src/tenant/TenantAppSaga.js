import { put, takeEvery, all } from "redux-saga/effects";
import * as TenantAppModule from "./TenantAppModule";
import axios from "axios";
import makeTemplateMaker from "./EnvironmentTemplateMaker";
import * as AwsAppSaga from "../aws/AwsAppSaga";
import makeOperation from "./OperationTemplateMaker";
import {createVPC} from "../operation/CreateEC2InfraCommand";

const searchSource = process.env.REACT_APP_DEV_SEARCH_SOURCE_URL;
const baseEndPoint = process.env.REACT_APP_DEV_API_URL;

function* handleRequestList(action) {
  try {
    let executeQuery = {};
    let way = "";
    if(action.keyword!=null&&action.keyword!=""){
      //キーワード検索
      executeQuery = {
        "query": {
          "multi_match": {
            "fields": [ "tenantName", "alias"],
            "query": "鈴木",
          }
        },
        "_source" : ["data"],
        "from" : action.from,
        "size" : action.size,
        "highlight": { "fields": {"tenantName": {}}}
      };
      way="keyword";
    }else{
      //全件取得
      executeQuery = {
        "query": {
          "match_all": {}
        },
        "_source" : ["data"],
        "from" :action.from,
        "size" : action.size,
      };
      way="simple";
    }

    console.log(executeQuery);
    const res = yield axios.post(searchSource + '/cmp/tenant/_search',
        JSON.stringify(executeQuery) ,
        {headers: {'Content-Type': 'application/json'}}
        );
    res.data["way"]=way;
    console.log(res.data);
    yield put({
      type: TenantAppModule.GET_LIST_SUCCESS,
      datas: res.data,
      receivedAt: Date.now(),
    });
  } catch (e) {
    yield put({
      type: TenantAppModule.GET_LIST_FAILURE,
      e,
    });
  }
}
function* handleRequestData(action) {
  try {
    const id = action.id;
    const res = yield axios.get(baseEndPoint + `/tenant/` + id);
    yield put({
      type: TenantAppModule.GET_DETAIL_SUCCESS,
      data: res.data,
      receivedAt: Date.now(),
    });
  } catch (e) {
    yield put({
      type: TenantAppModule.GET_DETAIL_FAILURE,
      e,
    });
  }
}
function* handleRequestUpdate(action) {
  try {
    const data = action.data;
    let currentRevision = data["revision"];
    if (currentRevision === null) {
      //for dirty data
      currentRevision = 1;
    }
    data["revision"] = currentRevision + 1;
    const res = yield axios.put(baseEndPoint + `/tenant/` + data.id, data);
    yield put({
      type: TenantAppModule.UPDATE_SUCCESS,
      data: res.data,
      receivedAt: Date.now(),
    });
  } catch (e) {
    yield put({
      type: TenantAppModule.UPDATE_FAILURE,
      e,
    });
  }
}
function* handleRequestAdd(action) {
  try {
    const data = action.data;
    data["revision"] = 1;
    const res = yield axios.post(baseEndPoint + `/tenant`, data);
    yield put({
      type: TenantAppModule.ADD_SUCCESS,
      data: res.data,
      receivedAt: Date.now(),
    });
  } catch (e) {
    yield put({
      type: TenantAppModule.ADD_FAILURE,
      e,
    });
  }
}

function* handleRequestDel(action) {
  try {
    const id = action.id;
    const res = yield axios.delete(baseEndPoint + `/tenant/` + id);
    yield put({
      type: TenantAppModule.DEL_SUCCESS,
      data: res.data,
      receivedAt: Date.now(),
    });
  } catch (e) {
    yield put({
      type: TenantAppModule.DEL_FAILURE,
      e,
    });
  }
}

function* handleRequestNewEnv(action) {
  const tenant = action.data;
  let ret = makeTemplateMaker(tenant);
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

function* handleInvokeOperation(action) {
  const envIndex = action.envIndex;
  const env    = action.env;
  const resource = env.resources;
  const apiKey = action.apiKey;
  const apiPwd = action.apiPwd;
  const que = { vpc : resource };
  createVPC(que , apiKey , apiPwd);

  yield put({
    type: TenantAppModule.INVOKE_OPERATION_SUCCESS,
    envIndex: envIndex,
  });
}

function* mySaga() {
  all(
    yield takeEvery(TenantAppModule.GET_LIST_REQUEST, handleRequestList),
    yield takeEvery(TenantAppModule.GET_DETAIL_REQUEST, handleRequestData),
    yield takeEvery(TenantAppModule.UPDATE_REQUEST, handleRequestUpdate),
    yield takeEvery(TenantAppModule.ADD_REQUEST, handleRequestAdd),
    yield takeEvery(TenantAppModule.DEL_REQUEST, handleRequestDel),
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
