import {
  setProperty,
  pushEmptyToArray,
  spliceObjOfArray,
} from "../../util/JsonUtils";
import {getNowYMD} from "../../util/DateUtils";
import * as CommonCost from "../../common/CommonConst"
import {ADD_SUCCESS} from "./AddNewModule";
import {
  GET_OPERATION_REQUEST,
  INVOKE_OPERATION_REQUEST, INVOKE_OPERATION_STARTED,
  NEW_ENV_REQUEST,
  NEW_ENV_SUCCESS, RESET_OPERATION_REQUEST,
  UPDATE_ENV_SUCCESS
} from "./EnvironmentModule";


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



export const noLoading = 0;
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
  blocking : false,
  updateComplete : noLoading,
  tenant: {},
};


export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SUCCESS:
      return {...state,blocking: false};
    case GOTO_DETAIL:
      return { ...state, tenant: null, blocking: true,updateComplete : noLoading };
    case GET_DETAIL_REQUEST:
      return { ...state, blocking: true,updateComplete : noLoading };
    case GET_DETAIL_SUCCESS:
      return {...state, tenant: action.tenant, updateComplete: noNeed,blocking: false};
    case GET_DETAIL_FAILURE:
      return { ...state, tenant: null }; //どうするのが正しいか未定
    case CHANGE_PROPERTY:
      const newData = { ...state.tenant };
      setProperty(newData, action.name, action.value);
      return { ...state, tenant: newData, updateComplete: necessary };
    case NEW_ENV_REQUEST:
      return { ...state, blocking: true };
    case NEW_ENV_SUCCESS:
      return { ...state, blocking: false,updateComplete : noNeed };
    case UPDATE_REQUEST:
      return { ...state, blocking: true };
    case UPDATE_SUCCESS:
      return { ...state, blocking: false,updateComplete : noNeed };
    case UPDATE_FAILURE:
      return { ...state, blocking: false };
    case DEL_REQUEST:
      return { ...state, blocking: true };
    case DEL_SUCCESS:
      return { ...state, blocking: false };
    case DEL_FAILURE:
      return { ...state, blocking: false };
    //ここから先は細かい処理
    case PUSH_EMPTY_TO_ARRAY:
      return {...state, operationType: PUSH_EMPTY_TO_ARRAY,
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
    case GET_OPERATION_REQUEST:
    case RESET_OPERATION_REQUEST:
    case INVOKE_OPERATION_REQUEST:
      return { ...state, blocking: true };
    case INVOKE_OPERATION_STARTED:
    case UPDATE_ENV_SUCCESS:
      return { ...state, blocking: false ,updateComplete : noNeed};
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

