import React from "react";
import * as tenantAppModule from "./TenantAppModule";
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
          <TenantProfilePage
            updateComplete={updateComplete}
            changeProperty={props.changeProperty}
            pushEmpty={props.pushEmpty}
            delFromArray={props.delFromArray}
            tenant={props.tenant}
            requestUpdate={props.requestUpdate}
            backToList="/tenant/list"
            requestNewEnv={props.requestNewEnv}
          />
        </React.Fragment>
      );
    default:
  }
}

const mapStateToProps = (state) => {
  return {
    operationType: state.operationType,
    getDetailComplete: state.getDetailComplete,
    updateComplete: state.updateComplete,
    tenant: state.tenant,
    invokeOperation : state.invokeOperation
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestUpdate: (tenant) => dispatch(tenantAppModule.requestUpdate(tenant)),
    changeProperty: (e) => dispatch(tenantAppModule.changeProperty(e)),
    requestLoadDetail: (id) => dispatch(tenantAppModule.requestLoadDetail(id)),
    pushEmpty: (path, empty) =>
      dispatch(tenantAppModule.pushEmpty(path, empty)),
    delFromArray: (path, index) =>
      dispatch(tenantAppModule.delFromArray(path, index)),
    requestNewEnv: (tenant) => dispatch(tenantAppModule.requestNewEnv(tenant)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantProfile);
