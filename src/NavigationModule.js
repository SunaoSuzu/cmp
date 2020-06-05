const HOME = "HOME";
const MENU = "MENU";
const REPORT = "REPORT";
const NOTICE = "NOTICE";
const PROFILE = "PROFILE";
const ACCOUNT = "ACCOUNT";
const SEARCH = "SEARCH";
const LOGOUT = "LOGOUT";

const SUCCESS_AUTH = "SUCCESS_AUTH";

const GET_STATUS    = "GET_STATUS";
const ON_SUCCESS_GET_STATUS    = "ON_SUCCESS_GET_STATUS";
const JOB_COMPLETE = "JOB_COMPLETE";


const initialState = {
  authorized : false,         //ここも変わるはず
  userInfo   : null,          //とりあえず平文でUsreId持っておくけどあとで変える
  functionType: HOME,
  selectedMenuId: null,
  targetReportId: null,
  targetOperations : [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ON_SUCCESS_GET_STATUS:
      return {...state , targetOperations : action.payload };
    case JOB_COMPLETE:
      return {...state};
    case SUCCESS_AUTH:
      return {
        ...state,
        authorized: true,
        userInfo: action.uid,
        functionType: SUCCESS_AUTH,
        selectedMenuId: null,
        selectedReportId: null,
      };
    case MENU:
      return {
        ...state,
        functionType: MENU,
        selectedMenuId: action.menu.menuId,
        selectedReportId: null,
      };
    case REPORT:
      return {
        ...state,
        functionType: REPORT,
        selectedMenuId: null,
        selectedReportId: action.report.reportId,
      };
    case HOME:
    case NOTICE:
    case PROFILE:
    case ACCOUNT:
    case SEARCH:
      return {
        ...state,
        functionType: action.type,
        selectedMenuId: null,
        selectedReportId: null,
      };
    case LOGOUT:
      return {
        ...state,
        authorized: false,
        userInfo: null,
        functionType: action.type,
        selectedMenuId: null,
        selectedReportId: null,
      };
    default:
      return state;
  }
}

// Action Creators
export const startMonitor = () => {
  console.log("startMonitor");
  return {
    type: GET_STATUS,
  };
};

export const selectMenu = (menu) => {
  return {
    type: MENU,
    menu: menu,
  };
};

export const selectHome = () => {
  return {
    type: HOME,
  };
};

export const selectReport = (report) => {
  console.log(report);
  return {
    type: REPORT,
    report: report,
  };
};

export const selectProfile = () => {
  return {
    type: PROFILE,
  };
};

export const selectAccount = () => {
  return {
    type: ACCOUNT,
  };
};

export const selectNotice = () => {
  return {
    type: NOTICE,
  };
};

export const selectSearch = () => {
  return {
    type: SEARCH,
  };
};

export const selectLogout = () => {
  return {
    type: LOGOUT,
  };
};

export const authSuccess = (uid) => {
  return {
    type: SUCCESS_AUTH,
    uid : uid,
  };
};

