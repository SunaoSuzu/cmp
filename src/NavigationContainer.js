import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as navigationModule from "./NavigationModule";
import Navigation from "./Navigation";

const mapStateToProps = (state) => {
  return {
    functionType: state.functionType,
    selectedMenuId: state.selectedMenuId,
    selectedReportId: state.selectedReportId,
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
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
