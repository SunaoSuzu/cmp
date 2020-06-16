const HOME = "HOME";
const MENU = "MENU";
const REPORT = "REPORT";
const NOTICE = "NOTICE";
const PROFILE = "PROFILE";
const ACCOUNT = "ACCOUNT";
const SEARCH = "SEARCH";

export const GET_STATUS    = "GET_STATUS";
export const ON_SUCCESS_GET_STATUS    = "ON_SUCCESS_GET_STATUS";
export const JOB_UPDATE = "JOB_UPDATE";


const initialState = {
  functionType: HOME,
  selectedMenuId: null,
  targetReportId: null,
  targetOperations : [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case JOB_UPDATE:
      return {...state , targetOperations : action.payload };
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
