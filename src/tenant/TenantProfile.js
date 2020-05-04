import React from "react";
import * as tenantAppModule from "./TenantAppModule";
import {connect} from "react-redux";
import TenantProfilePage from "./TenantProfilePage";




function ItemDetail(props) {
    console.log(JSON.stringify(props));

    return (

        <React.Fragment>
            <div>TenantDetail(tenantId = {props.match.params.tenantId})</div>
            <TenantProfilePage data={props.data} updateData={props.updateData} backToList="/tenant/list"
                               />
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        operationType  : state.operationType,
        data  : state.data,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        selectList: () => dispatch(tenantAppModule.selectList()),
        selectGoToAdd: () => dispatch(tenantAppModule.selectGoToAdd()),
        selectGoToDetail: (data) => dispatch(tenantAppModule.selectGoToDetail(data)),
        updateData: (data) => dispatch(tenantAppModule.updateData(data)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail);
