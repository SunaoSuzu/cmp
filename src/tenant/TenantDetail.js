import React from "react";
import * as tenantAppModule from "./TenantAppModule";
import {connect} from "react-redux";
import {Link, Route, useRouteMatch , Switch} from "react-router-dom";

function TenantDetail(props) {
    let { path, url } = useRouteMatch();
    return (

        <React.Fragment>
            <div>TenantDetail(tenantId = {props.match.params.tenantId})</div>
            <div>TenantDetail(dataId = {props.data.id})</div>
            <div>TenantDetail(dataName = {props.data.name})</div>
            <div>TenantDetail(dataLicences = {props.data.licences})</div>
            <div>TenantDetail(dataVersion = {props.data.version})</div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    console.log('mapStateToProps ' + JSON.stringify(state))
    return {
        operationType  : state.operationType,
        datas  : state.datas,
        data  : state.data,
        gridConf  : state.gridConf,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        selectList: () => dispatch(tenantAppModule.selectList()),
        selectGoToAdd: () => dispatch(tenantAppModule.selectGoToAdd()),
        selectGoToDetail: (data) => dispatch(tenantAppModule.selectGoToDetail(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TenantDetail);
