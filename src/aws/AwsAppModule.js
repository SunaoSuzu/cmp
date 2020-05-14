import {
  setProperty,
  pushEmptyToArray,
  spliceObjOfArray,
} from "../util/JsonUtils";

export const IMPORT_REQUEST = "IMPORT_REQUEST";
export const IMPORT_SUCCESS = "IMPORT_SUCCESS";
export const IMPORT_FAIL = "IMPORT_FAIL";
export const STORE_REQUEST = "STORE_REQUEST";
export const STORE_SUCCESS = "STORE_SUCCESS";
export const STORE_FAIL = "STORE_FAIL";

export const yet = 1;
export const necessary = 2;
export const requested = 3;
export const success = 4;
export const failed = 9;

// for new add

const initialState = {
  importComplete: yet,
  storeComplete: yet,
  importedData: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case IMPORT_REQUEST:
      return { ...state, importComplete: requested };
    case IMPORT_SUCCESS:
      return {
        ...state,
        importComplete: success,
        importedData: action.data,
        storeComplete: necessary,
      };
    case IMPORT_FAIL:
      return { ...state, importComplete: failed, storeComplete: yet };
    case STORE_REQUEST:
      return { ...state, storeComplete: requested };
    case STORE_SUCCESS:
      return { ...state, storeComplete: success, importedData: action.data };
    case STORE_FAIL:
      return { ...state, storeComplete: failed };
    default:
      return state;
  }
}

// Action Creators
export function requestImport() {
  return {
    type: IMPORT_REQUEST,
  };
}

export function requestStore(data) {
  return {
    type: STORE_REQUEST,
    data: data,
  };
}
