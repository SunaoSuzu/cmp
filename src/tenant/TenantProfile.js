import React from "react";
import * as tenantAppModule from "./module/TenantAppModule";
import { connect } from "react-redux";
import TenantProfilePage from "./TenantProfilePage";
import ActionProgress from "../components/ActionProgress";

function TenantProfile(props) {
  const tenantId = props.match.params.tenantId;
  const { getDetailComplete, requestLoadDetail, updateComplete,invokeOperation } = props;

  switch (getDetailComplete) {
    case tenantAppModule.yet:
      requestLoadDetail(tenantId);
      return <ActionProgress />;
    case tenantAppModule.requested:
      return <ActionProgress />;
    case tenantAppModule.loadSuccess:
      let Block = null;
      if (updateComplete === tenantAppModule.syncing||invokeOperation===tenantAppModule.requested) {
        Block= <ActionProgress />;
      }
      return (
        <React.Fragment>
          {Block}
          <TenantProfilePage />
        </React.Fragment>
      );
    default:
  }
}

const mapStateToProps = (state) => {
  return {
    getDetailComplete: state.tenant.getDetailComplete,
    updateComplete: state.tenant.updateComplete,
    invokeOperation : state.tenant.invokeOperation
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestLoadDetail: (id) => dispatch(tenantAppModule.requestLoadDetail(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantProfile);
