import NewTenantPage from "./NewTenentPage";
import * as tenantAppModule from "./module/TenantAppModule";
import * as addNew from "./module/AddNewModule";

import ActionProgress from "../components/ActionProgress";
import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

function NewTenant(props) {
  if (props.addComplete === tenantAppModule.syncing) {
    return <ActionProgress />;
  } else if (props.addComplete === tenantAppModule.synced) {
    return <Redirect to={"/tenant/profile/" + props.newData.id} />;
  } else {
    if (props.newData.name === undefined) {
      //HOT DEPLOYで進められるようにする
      props.selectGoToAdd();
      return <ActionProgress />;
    }

    return (
      <NewTenantPage
        addComplete={props.addComplete}
        changePropertyOfNew={props.changePropertyOfNew}
        pushEmptyForNew={props.pushEmptyForNew}
        delFromArrayForNew={props.delFromArrayForNew}
        requestAdd={props.requestAdd}
        newData={props.newData}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    addComplete: state.addNew.addComplete,
    newData: state.addNew.newData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectGoToAdd: () => dispatch(addNew.goToAdd()),
    requestAdd: (e) => dispatch(addNew.requestAdd(e)),
    changePropertyOfNew: (e) =>
      dispatch(addNew.changePropertyOfNew(e)),
    pushEmptyForNew: (path, empty) =>
      dispatch(addNew.pushEmptyForNew(path, empty)),
    delFromArrayForNew: (path, index) =>
      dispatch(addNew.delFromArrayForNew(path, index)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTenant);
