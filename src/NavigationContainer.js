import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as navigationModule from "./NavigationModule";
import Navigation from "./Navigation";

const mapStateToProps = (state) => {
  console.log(JSON.stringify(state));
  return {
    functionType: state.navigationReducer.functionType,
    selectedMenuId: state.navigationReducer.selectedMenuId,
    selectedReportId: state.navigationReducer.selectedReportId,
    authorized : state.navigationReducer.authorized,
    userInfo : state.navigationReducer.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectMenu: (menu) => dispatch(navigationModule.selectMenu(menu)),
    selectReport: (report) => dispatch(navigationModule.selectReport(report)),
    selectHome: () => dispatch(navigationModule.selectHome()),
    selectProfile: () => dispatch(navigationModule.selectProfile()),
    selectAccount: () => dispatch(navigationModule.selectAccount()),
    selectNotice: () => dispatch(navigationModule.selectNotice()),
    selectSearch: () => dispatch(navigationModule.selectSearch()),
    selectLogout: () => dispatch(navigationModule.selectLogout()),
    authSuccess: (uid) => dispatch(navigationModule.authSuccess(uid)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
