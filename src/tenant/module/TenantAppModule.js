import {
  setProperty,
  pushEmptyToArray,
  spliceObjOfArray,
} from "../../util/JsonUtils";
import {getNowYMD} from "../../util/DateUtils";
import * as CommonCost from "../../common/CommonConst"
import {ADD_SUCCESS} from "./AddNewModule";


export const GOTO_DETAIL = "GOTO_DETAIL";
export const GET_DETAIL_REQUEST = "GET_DETAIL_REQUEST";
export const GET_DETAIL_SUCCESS = "GET_DETAIL_SUCCESS";
export const GET_DETAIL_FAILURE = "GET_DETAIL_FAILURE";

export const CHANGE_PROPERTY = "CHANGE_PROPERTY";
export const UPDATE_REQUEST = "UPDATE_REQUEST";
export const UPDATE_SUCCESS = "UPDATE_SUCCESS";
export const UPDATE_FAILURE = "UPDATE_FAILURE";

export const DEL_REQUEST = "DEL_REQUEST";
export const DEL_SUCCESS = "DEL_SUCCESS";
export const DEL_FAILURE = "DEL_FAILURE";

//
export const PUSH_EMPTY_TO_ARRAY = "PUSH_EMPTY_TO_ARRAY";
export const DEL_FROM_ARRAY = "DEL_FROM_ARRAY";


export const ATTACH_AWS_REQUEST = "ATTACH_AWS_REQUEST";
export const ATTACH_AWS_SUCCESS = "ATTACH_AWS_SUCCESS";
export const ATTACH_AWS_FAIL = "ATTACH_AWS_FAIL";

export const GET_OPERATION_REQUEST = "GET_OPERATION_REQUEST";
export const GET_OPERATION_SUCCESS = "GET_OPERATION_SUCCESS";
export const GET_OPERATION_FAIL = "GET_OPERATION_FAIL";

export const INVOKE_OPERATION_REQUEST = "INVOKE_OPERATION_REQUEST";
export const INVOKE_OPERATION_STARTED = "INVOKE_OPERATION_STARTED";
export const INVOKE_OPERATION_SUCCESS = "INVOKE_OPERATION_SUCCESS";
export const INVOKE_OPERATION_FAIL = "INVOKE_OPERATION_FAIL";

export const RESET_OPERATION_REQUEST = "RESET_OPERATION_REQUEST";

export const noNeed = 1;
export const necessary = 2;
export const syncing = 3;
export const synced = 4;
export const failed = 9;

export const yet = 1;
export const requested = 2;
export const started   = 3;
export const loadSuccess = 4;
export const loadFailed = 9;

// for new add
export const empty_contract = { productMstId: "", amount: "" };

const initialState = {

  tenant: {},
  getDetailComplete: yet,
  updateComplete: noNeed,

  deleteComplete: yet,


  attachAwsCompleted: yet,
  attachedAwsInfo: null,

  getOperationCompleted: yet,
  operations: null,

  invokeOperation: yet,
};


export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SUCCESS:
      return {
        getDetailComplete: yet,
      };
    case GOTO_DETAIL:
      return { ...state, tenant: null, getDetailComplete: yet };
    case GET_DETAIL_REQUEST:
      return { ...state, getDetailComplete: requested };
    case GET_DETAIL_SUCCESS:
      return {
        ...state,
        tenant: action.tenant,
        getDetailComplete: loadSuccess,
        updateComplete: noNeed,
      };
    case GET_DETAIL_FAILURE:
      return { ...state, tenant: null, getDetailComplete: loadFailed }; //どうするのが正しいか未定
    case CHANGE_PROPERTY:
      const newData = { ...state.tenant };
      setProperty(newData, action.name, action.value);
      return { ...state, tenant: newData, updateComplete: necessary };
    case UPDATE_REQUEST:
      return { ...state, updateComplete: syncing };
    case UPDATE_SUCCESS:
      return { ...state, updateComplete: synced };
    case UPDATE_FAILURE:
      return { ...state, updateComplete: failed };
    case DEL_REQUEST:
      return { ...state, delComplete: syncing };
    case DEL_SUCCESS:
      return { ...state, delComplete: synced };
    case DEL_FAILURE:
      return { ...state, delComplete: failed };
    //ここから先は細かい処理
    case PUSH_EMPTY_TO_ARRAY:
      return {
        ...state,
        operationType: PUSH_EMPTY_TO_ARRAY,
        tenant: pushEmptyToArray({ ...state.tenant }, action.path, action.empty),
        addComplete: necessary,
      };
    case DEL_FROM_ARRAY:
      return {
        ...state,
        operationType: DEL_FROM_ARRAY,
        tenant: spliceObjOfArray({ ...state.tenant }, action.path, action.index),
        addComplete: necessary,
      };
    case ATTACH_AWS_REQUEST:
      return { ...state, attachAwsCompleted: requested, attachedAwsInfo: null };
    case ATTACH_AWS_SUCCESS:
      {
        let tenantObj = { ...state.tenant };
        let env = tenantObj.environments[action.envIndex];
        env["attached"] = { result: action.data , status : loadSuccess , execDate : getNowYMD()};
        return {
          ...state,
          attachAwsCompleted: loadSuccess,
          tenant: tenantObj,
          attachedAwsInfo: action.data,
        };

      }
    case ATTACH_AWS_FAIL:

      return {
        ...state,
        attachAwsCompleted: loadFailed,
        attachedAwsInfo: null,
      };
    case GET_OPERATION_REQUEST:
      return { ...state, getOperationCompleted: requested, operations: null };
    case GET_OPERATION_SUCCESS: {

      let tenantObj = { ...state.tenant };
      let env = tenantObj.environments[action.envIndex];
      env["resources"] = action.resources;
      env["operations"] = action.operations;
      env.status=CommonCost.STATUS_PLANED;
      return {
        ...state,
        getOperationCompleted: loadSuccess,
        tenant: tenantObj,
        operations: action.resources,
      };
    }
    case GET_OPERATION_FAIL:
      return { ...state, getOperationCompleted: loadFailed, operations: null };
    case INVOKE_OPERATION_REQUEST:
      return { ...state, invokeOperation: requested };
    case INVOKE_OPERATION_STARTED:
      return { ...state, invokeOperation: started , tenant: action.tenant};
    case INVOKE_OPERATION_SUCCESS: {
      return { ...state, invokeOperation: loadSuccess, tenant: action.tenant };
    }
    case INVOKE_OPERATION_FAIL:
      return { ...state, invokeOperation: loadFailed };
    case RESET_OPERATION_REQUEST: {
      let tenantObj = { ...state.tenant };
      let env = tenantObj.environments[action.envIndex];
      delete env.operations;
      delete env.resources;
      delete env.stack;
      env.status = CommonCost.STATUS_DRAFT;
      return { ...state, invokeOperation: loadSuccess, tenant: tenantObj };
    }
    default:
      return state;
  }
}

// Action Creators

export const selectGoToDetail = (tenant) => {
  return {
    type: GOTO_DETAIL,
    tenant: tenant,
  };
};

export const requestLoadDetail = (id) => {
  return {
    type: GET_DETAIL_REQUEST,
    id: id,
  };
};

export const changeProperty = (e) => {
  return {
    type: CHANGE_PROPERTY,
    name: e.target.name,
    value: e.target.value,
  };
};


export const requestUpdate = (tenant) => {
  return {
    type: UPDATE_REQUEST,
    tenant: tenant,
  };
};


export const requestDel = (id) => {
  return {
    type: DEL_REQUEST,
    id: id,
  };
};

//

export const pushEmpty = (path, empty) => {
  return {
    type: PUSH_EMPTY_TO_ARRAY,
    path: path,
    empty: empty,
  };
};


export const delFromArray = (path, index) => {
  return {
    type: DEL_FROM_ARRAY,
    path: path,
    index: index,
  };
};

export const requestAttachAws = (tenantTag, envTag, envIndex,akey , apwd) => {
  return {
    type: ATTACH_AWS_REQUEST,
    tenantTag: tenantTag,
    envTag: envTag,
    envIndex: envIndex,
    apiKey : akey,
    apiPwd : apwd,
  };
};

export const requestGetOperation = (tenant, env, envIndex) => {
  return {
    type: GET_OPERATION_REQUEST,
    tenant: tenant,
    env: env,
    envIndex: envIndex,
  };
};

export const requestInvokeOperation = (tenant, env, envIndex , apiKey , apiPwd) => {
  return {
    type: INVOKE_OPERATION_REQUEST,
    tenant: tenant,
    env: env,
    envIndex: envIndex,
    apiKey : apiKey,
    apiPwd : apiPwd,
  };
};

export const requestResetOperation = (tenant, env, envIndex) => {
  return {
    type: RESET_OPERATION_REQUEST,
    tenant: tenant,
    env: env,
    envIndex: envIndex,
  };
};
