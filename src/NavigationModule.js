
const HOME = "HOME"
const MENU = "MENU"
const REPORT = "REPORT"
const NOTICE = "NOTICE"
const PROFILE = "PROFILE"
const ACCOUNT = "ACCOUNT"
const SEARCH = "SEARCH"
const LOGOUT    = "LOGOUT"

const initialState = {
    functionType : HOME,
    selectedMenuId: null,
    targetReportId: null
}

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case MENU:
            return {
                functionType : MENU,
                selectedMenuId : action.menu.menuId,
                selectedReportId:null
            };
        case REPORT:
            return {
                functionType : REPORT,
                selectedMenuId : null,
                selectedReportId:action.report.reportId,
            };
        case HOME:
        case NOTICE:
        case PROFILE:
        case ACCOUNT:
        case SEARCH:
        case LOGOUT:
            return {
                functionType : action.type,
                selectedMenuId : null,
                selectedReportId:null,
            };
        default:
            return state;
    }
}

// Action Creators
export const selectMenu  = (menu) => {
    return {
        type: MENU,
        menu: menu
    }
}

export const selectHome  = () => {
    return {
        type: HOME,
    };
}

export const selectReport  = (report) => {
    console.log(report)
    return {
        type: REPORT,
        report : report,
    };
}

export const selectProfile  = () => {
    return {
        type: PROFILE,
    };
}

export const selectAccount  = () => {
    return {
        type: ACCOUNT,
    };
}

export const selectNotice  = () => {
    return {
        type: NOTICE,
    };
}

export const selectSearch  = () => {
    return {
        type: SEARCH,
    };
}

export const selectLogout  = () => {
    return {
        type: LOGOUT,
    };
}
