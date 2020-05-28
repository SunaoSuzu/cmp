import React from "react";
import * as tenantAppModule from "./TenantAppModule";
import { connect } from "react-redux";
import TenantProfilePage from "./TenantProfilePage";
import ActionProgress from "../components/ActionProgress";

function TenantProfile(props) {
  const tenantId = props.match.params.tenantId;
  const { getDetailComplete, requestLoadDetail, updateComplete } = props;

  switch (getDetailComplete) {
    case tenantAppModule.yet:
      requestLoadDetail(tenantId);
      return <ActionProgress />;
    case tenantAppModule.requested:
      return <ActionProgress />;
    case tenantAppModule.loadSuccess:
      let Block = null;
      if (updateComplete === tenantAppModule.syncing) {
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
            data={props.data}
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
    data: state.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestUpdate: (data) => dispatch(tenantAppModule.requestUpdate(data)),
    changeProperty: (e) => dispatch(tenantAppModule.changeProperty(e)),
    requestLoadDetail: (id) => dispatch(tenantAppModule.requestLoadDetail(id)),
    pushEmpty: (path, empty) =>
      dispatch(tenantAppModule.pushEmpty(path, empty)),
    delFromArray: (path, index) =>
      dispatch(tenantAppModule.delFromArray(path, index)),
    requestNewEnv: (data) => dispatch(tenantAppModule.requestNewEnv(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantProfile);
