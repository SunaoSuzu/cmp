import React from "react";
import * as tenantAppModule from "./TenantAppModule";
import {connect} from "react-redux";
import TenantProfilePage from "./TenantProfilePage";
import CircularProgress from "@material-ui/core/CircularProgress";

//


function TenantProfile(props) {
    const tenantId=props.match.params.tenantId;
    const {getDetailComplete,loadDetail,updateComplete} = props;
    console.log("page.getDetailComplete" + getDetailComplete);

    switch (getDetailComplete) {
        case tenantAppModule.yet:
            loadDetail(tenantId);
            return       <CircularProgress />;
        case tenantAppModule.requested:
            return       <CircularProgress />;
        case tenantAppModule.loadSuccess:
            if(updateComplete===tenantAppModule.syncing){
                return       <CircularProgress />;
            }else{
                return (
                    <React.Fragment>
                        <div>TenantDetail(tenantId = {tenantId})</div>
                        <TenantProfilePage updateComplete={props.updateComplete} changeProperty={props.changeProperty} data={props.data} updateData={props.updateData} backToList="/tenant/list"
                        />
                    </React.Fragment>
                );

            }
        default:
    }
}

const mapStateToProps = state => {
    return {
        operationType  : state.operationType,
        getDetailComplete : state.getDetailComplete,
        updateComplete : state.updateComplete,
        data  : state.data,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        selectList: () => dispatch(tenantAppModule.selectList()),
        selectGoToAdd: () => dispatch(tenantAppModule.selectGoToAdd()),
        selectGoToDetail: (data) => dispatch(tenantAppModule.selectGoToDetail(data)),
        updateData: (data) => dispatch(tenantAppModule.updateData(data)),
        changeProperty: (e) => dispatch(tenantAppModule.changeProperty(e)),
        loadDetail: (id) => dispatch(tenantAppModule.loadDetail(id)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantProfile);
