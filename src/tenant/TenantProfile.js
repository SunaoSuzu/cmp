import React from "react";
import * as tenantAppModule from "./TenantAppModule";
import { connect } from "react-redux";
import TenantProfilePage from "./TenantProfilePage";
import ActionProgress from "../components/ActionProgress";
import { yet } from "./TenantAppModule";

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
      if (updateComplete === tenantAppModule.syncing) {
        return <ActionProgress />;
      } else {
        return (
          <React.Fragment>
            <TenantProfilePage
              updateComplete={updateComplete}
              changeProperty={props.changeProperty}
              pushEmpty={props.pushEmpty}
              delFromArray={props.delFromArray}
              data={props.data}
              requestUpdate={props.requestUpdate}
              backToList="/tenant/list"
              requestNewEnv={props.requestNewEnv}
              attachAws={props.attachAws}
              attachedAwsInfo={props.attachedAwsInfo}
              attachAwsCompleted={props.attachAwsCompleted}
              requestGetOperation={props.requestGetOperation}
              requestInvokeOperation={props.requestInvokeOperation}
              getOperationCompleted={props.getOperationCompleted}
              operations={props.operations}
            />
          </React.Fragment>
        );
      }
    default:
  }
}

const mapStateToProps = (state) => {
  return {
    operationType: state.operationType,
    getDetailComplete: state.getDetailComplete,
    updateComplete: state.updateComplete,
    data: state.data,
    getOperationCompleted: state.getOperationCompleted,
    operations: state.operations,
    attachedAwsInfo: state.attachedAwsInfo,
    attachAwsCompleted: state.attachAwsCompleted,
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
    requestGetOperation: (tenant, env, envIndex) =>
      dispatch(tenantAppModule.requestGetOperation(tenant, env, envIndex)),
    requestInvokeOperation: (tenant, env, envIndex) =>
      dispatch(tenantAppModule.requestInvokeOperation(tenant, env, envIndex)),
    attachAws: (tenantTag, envTag, envIndex) =>
      dispatch(tenantAppModule.requestAttachAws(tenantTag, envTag, envIndex)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantProfile);
