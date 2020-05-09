import React from "react";
import * as tenantAppModule from "./TenantAppModule";
import {connect} from "react-redux";
import TenantProfilePage from "./TenantProfilePage";
import CircularProgress from "@material-ui/core/CircularProgress";

//


function TenantProfile(props) {
    const tenantId=props.match.params.tenantId;
    const {getDetailComplete,requestLoadDetail,updateComplete} = props;

    switch (getDetailComplete) {
        case tenantAppModule.yet:
            requestLoadDetail(tenantId);
            return       <CircularProgress />;
        case tenantAppModule.requested:
            return       <CircularProgress />;
        case tenantAppModule.loadSuccess:
            if(updateComplete===tenantAppModule.syncing){
                return       <CircularProgress />;
            }else{
                return (
                    <React.Fragment>
                        <TenantProfilePage updateComplete={updateComplete}
                                           changeProperty={props.changeProperty}
                                           pushEmpty={props.pushEmpty}
                                           delFromArray={props.delFromArray}
                                           data={props.data}
                                           requestUpdate={props.requestUpdate} backToList="/tenant/list"
                                           requestNewEnv={props.requestNewEnv}
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
        requestUpdate: (data) => dispatch(tenantAppModule.requestUpdate(data)),
        changeProperty: (e) => dispatch(tenantAppModule.changeProperty(e)),
        requestLoadDetail: (id) => dispatch(tenantAppModule.requestLoadDetail(id)),
        pushEmpty: (path,empty) => dispatch(tenantAppModule.pushEmpty(path,empty)),
        delFromArray: (path,index) => dispatch(tenantAppModule.delFromArray(path,index)),
        requestNewEnv: (data) => dispatch(tenantAppModule.requestNewEnv(data)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantProfile);
