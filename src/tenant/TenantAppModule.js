import {
  setProperty,
  pushEmptyToArray,
  spliceObjOfArray,
} from "../util/JsonUtils";
import {getNowYMD} from "../util/DateUtils";

export const GET_LIST_REQUEST = "GET_LIST_REQUEST";
export const GET_LIST_SUCCESS = "GET_LIST_SUCCESS";
export const GET_LIST_FAILURE = "GET_LIST_FAILURE";

export const GOTO_DETAIL = "GOTO_DETAIL";
export const GET_DETAIL_REQUEST = "GET_DETAIL_REQUEST";
export const GET_DETAIL_SUCCESS = "GET_DETAIL_SUCCESS";
export const GET_DETAIL_FAILURE = "GET_DETAIL_FAILURE";

export const CHANGE_PROPERTY = "CHANGE_PROPERTY";
export const UPDATE_REQUEST = "UPDATE_REQUEST";
export const UPDATE_SUCCESS = "UPDATE_SUCCESS";
export const UPDATE_FAILURE = "UPDATE_FAILURE";

export const GOTO_ADD = "GOTO_ADD";
export const CHANGE_PROPERTY_OF_NEW = "CHANGE_PROPERTY_OF_NEW";
export const ADD_REQUEST = "ADD_REQUEST";
export const ADD_SUCCESS = "ADD_SUCCESS";
export const ADD_FAILURE = "ADD_FAILURE";

export const DEL_REQUEST = "DEL_REQUEST";
export const DEL_SUCCESS = "DEL_SUCCESS";
export const DEL_FAILURE = "DEL_FAILURE";

//
export const PUSH_EMPTY_TO_ARRAY = "PUSH_EMPTY_TO_ARRAY";
export const PUSH_EMPTY_TO_ARRAY_NEW = "PUSH_EMPTY_TO_ARRAY_NEW";
export const DEL_FROM_ARRAY = "DEL_FROM_ARRAY";
export const DEL_FROM_ARRAY_NEW = "DEL_FROM_ARRAY_NEW";

export const NEW_ENV_REQUEST = "NEW_ENV_REQUEST";
export const NEW_ENV_SUCCESS = "NEW_ENV_SUCCESS";

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
export const loadSuccess = 3;
export const loadFailed = 9;

// for new add
export const empty_contract = { productMstId: "", amount: "" };

export const empty = {
  name: "",
  status: 1,
  statusCaption: "下書き",
  tags: [{}],
  environmentSetting: {
    vpcType: 1,
  },
  contract: {
    details: [
      { productMstId: "", amount: "" }, //empty_contractを参照できない
    ],
  },
  environments: [],
};

const initialState = {
  breadcrumbStack: [],

  loadSuccess: yet,
  datas: [],

  data: {},
  getDetailComplete: yet,
  updateComplete: noNeed,

  newData: {},
  addComplete: noNeed,

  deleteComplete: yet,

  newEnvComplated: yet,

  attachAwsCompleted: yet,
  attachedAwsInfo: null,

  getOperationCompleted: yet,
  operations: null,

  invokeOperation: yet,
};

const breadcrumbStackList = { caption: "テナント一覧", to: "/tenant/list" };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_LIST_REQUEST:
      return {
        ...state,
        loadSuccess: requested,
        breadcrumbStack: [],
        data: null,
        newData: null,
        datas: [],
      };
    case GET_LIST_SUCCESS:
      return { ...state, loadSuccess: loadSuccess, datas: action.datas };
    case GET_LIST_FAILURE:
      return { ...state, loadSuccess: loadFailed, datas: [] }; //どうするのが正しいか未定
    case GOTO_DETAIL:
      return { ...state, data: null, newData: null, getDetailComplete: yet };
    case GET_DETAIL_REQUEST:
      return { ...state, getDetailComplete: requested };
    case GET_DETAIL_SUCCESS:
      return {
        ...state,
        data: action.data,
        getDetailComplete: loadSuccess,
        updateComplete: noNeed,
        breadcrumbStack: [breadcrumbStackList],
      };
    case GET_DETAIL_FAILURE:
      return { ...state, data: null, getDetailComplete: loadFailed }; //どうするのが正しいか未定
    case CHANGE_PROPERTY:
      const newData = { ...state.data };
      setProperty(newData, action.name, action.value);
      return { ...state, data: newData, updateComplete: necessary };
    case UPDATE_REQUEST:
      return { ...state, updateComplete: syncing };
    case UPDATE_SUCCESS:
      return { ...state, updateComplete: synced };
    case UPDATE_FAILURE:
      return { ...state, updateComplete: failed };
    case GOTO_ADD:
      return {
        ...state,
        newData: { ...empty },
        addComplete: noNeed,
        breadcrumbStack: [breadcrumbStackList],
      };
    case CHANGE_PROPERTY_OF_NEW:
      const obj = { ...state.newData };
      setProperty(obj, action.name, action.value);
      return { ...state, newData: obj, addComplete: necessary };
    case ADD_REQUEST:
      return { ...state, addComplete: syncing };
    case ADD_SUCCESS:
      return {
        ...state,
        addComplete: synced,
        newData: action.data,
        getDetailComplete: yet,
      };
    case ADD_FAILURE:
      return { ...state, addComplete: failed };
    case DEL_REQUEST:
      return { ...state, delComplete: syncing };
    case DEL_SUCCESS:
      return { ...state, delComplete: synced, loadSuccess: yet, datas: null };
    case DEL_FAILURE:
      return { ...state, delComplete: failed };
    //ここから先は細かい処理
    case PUSH_EMPTY_TO_ARRAY_NEW:
      return {
        ...state,
        operationType: PUSH_EMPTY_TO_ARRAY_NEW,
        newData: pushEmptyToArray(
          { ...state.newData },
          action.path,
          action.empty
        ),
        addComplete: necessary,
      };
    case PUSH_EMPTY_TO_ARRAY:
      return {
        ...state,
        operationType: PUSH_EMPTY_TO_ARRAY,
        data: pushEmptyToArray({ ...state.data }, action.path, action.empty),
        addComplete: necessary,
      };
    case DEL_FROM_ARRAY_NEW:
      return {
        ...state,
        operationType: DEL_FROM_ARRAY_NEW,
        newData: spliceObjOfArray(
          { ...state.newData },
          action.path,
          action.index
        ),
        addComplete: necessary,
      };
    case DEL_FROM_ARRAY:
      return {
        ...state,
        operationType: DEL_FROM_ARRAY,
        data: spliceObjOfArray({ ...state.data }, action.path, action.index),
        addComplete: necessary,
      };
    case NEW_ENV_REQUEST:
      return { ...state, newEnvComplated: syncing };
    case NEW_ENV_SUCCESS: {
      const tenantObj = { ...state.data };
      const environment = action.environment;
      tenantObj.environments = tenantObj.environments.concat(environment);
      return { ...state, newEnvComplated: synced, data: tenantObj };
    }
    case ATTACH_AWS_REQUEST:
      return { ...state, attachAwsCompleted: requested, attachedAwsInfo: null };
    case ATTACH_AWS_SUCCESS:
      {
        let tenantObj = { ...state.data };
        let env = tenantObj.environments[action.envIndex];
        env["attached"] = { result: action.data , status : loadSuccess , execDate : getNowYMD()};
        return {
          ...state,
          attachAwsCompleted: loadSuccess,
          data: tenantObj,
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
      let tenantObj = { ...state.data };
      let env = tenantObj.environments[action.envIndex];
      env["resources"] = action.resources;
      env["operations"] = action.operations;
      return {
        ...state,
        getOperationCompleted: loadSuccess,
        data: tenantObj,
        operations: action.resources,
      };
    }
    case GET_OPERATION_FAIL:
      return { ...state, getOperationCompleted: loadFailed, operations: null };
    case INVOKE_OPERATION_REQUEST:
      return { ...state, invokeOperation: requested };
    case INVOKE_OPERATION_STARTED:
      return { ...state, invokeOperation: started };
    case INVOKE_OPERATION_SUCCESS: {
      let tenantObj = { ...state.data };
      let env = tenantObj.environments[action.envIndex];
      env.status = 10;
      return { ...state, invokeOperation: loadSuccess, data: tenantObj };
    }
    case INVOKE_OPERATION_FAIL:
      return { ...state, invokeOperation: loadFailed };
    case RESET_OPERATION_REQUEST: {
      let tenantObj = { ...state.data };
      let env = tenantObj.environments[action.envIndex];
      delete env.operations;
      delete env.resources;
      env.status = 1;
      return { ...state, invokeOperation: loadSuccess, data: tenantObj };
    }
    default:
      return state;
  }
}

// Action Creators

export const requestList = () => {
  return {
    type: GET_LIST_REQUEST,
    from : 0,
    size : 1,
  };
};

export const requestSearchList = (keyword,from,size) => {
  return {
    type: GET_LIST_REQUEST,
    keyword : keyword,
    from : from,
    size : size,
  };
};

export const selectGoToAdd = () => {
  return {
    type: GOTO_ADD,
  };
};

export const selectGoToDetail = (data) => {
  return {
    type: GOTO_DETAIL,
    data: data,
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

export const changePropertyOfNew = (e) => {
  return {
    type: CHANGE_PROPERTY_OF_NEW,
    name: e.target.name,
    value: e.target.value,
  };
};

export const requestUpdate = (data) => {
  return {
    type: UPDATE_REQUEST,
    data: data,
  };
};

export const requestAdd = (data) => {
  return {
    type: ADD_REQUEST,
    data: data,
  };
};

export const requestDel = (id) => {
  return {
    type: DEL_REQUEST,
    id: id,
  };
};

//
export const pushEmptyForNew = (path, empty) => {
  return {
    type: PUSH_EMPTY_TO_ARRAY_NEW,
    path: path,
    empty: empty,
  };
};

export const pushEmpty = (path, empty) => {
  return {
    type: PUSH_EMPTY_TO_ARRAY,
    path: path,
    empty: empty,
  };
};

export const delFromArrayForNew = (path, index) => {
  return {
    type: DEL_FROM_ARRAY_NEW,
    path: path,
    index: index,
  };
};

export const delFromArray = (path, index) => {
  return {
    type: DEL_FROM_ARRAY,
    path: path,
    index: index,
  };
};

export const requestNewEnv = (data) => {
  return {
    type: NEW_ENV_REQUEST,
    data: data,
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
