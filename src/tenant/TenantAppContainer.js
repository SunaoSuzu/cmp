import { connect } from "react-redux";
import * as tenantAppModule from "./TenantAppModule";
import TenantApp from "./TenantApp";

const mapStateToProps = (state) => {
  return {
    operationType: state.operationType,
    breadcrumbStack: state.breadcrumbStack,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectList: () => dispatch(tenantAppModule.requestList()),
    selectGoToAdd: () => dispatch(tenantAppModule.selectGoToAdd()),
    selectGoToDetail: (data) =>
      dispatch(tenantAppModule.selectGoToDetail(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantApp);
