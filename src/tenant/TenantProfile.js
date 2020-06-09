import React from "react";
import * as tenantAppModule from "./module/TenantAppModule";
import { connect } from "react-redux";
import TenantProfilePage from "./TenantProfilePage";
import ActionProgress from "../components/ActionProgress";

function TenantProfile(props) {
  const tenantId = props.match.params.tenantId;
  const { blocking,updateComplete, requestLoadDetail} = props;

  if(updateComplete===tenantAppModule.noLoading){
    requestLoadDetail(tenantId);
    return <ActionProgress />;
  }
  const Block = blocking ? <ActionProgress /> : "";
  return (
    <React.Fragment>
      {Block}
      <TenantProfilePage />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    blocking: state.tenant.blocking,
    updateComplete: state.tenant.updateComplete,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestLoadDetail: (id) => dispatch(tenantAppModule.requestLoadDetail(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantProfile);
