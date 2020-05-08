import React from "react";
import SuTechGrid from "../asset/SuTechGrid";
import * as tenantAppModule from "./TenantAppModule";
import {connect} from "react-redux";
import CircularProgress from '@material-ui/core/CircularProgress';
import FabLink from "../asset/FabLink";
import getConfiguration from "../Configuration";


function TenantList(props) {
    const conf = getConfiguration();
    const gridConf = conf.tenantListGridConf;

    if (props.loadSuccess===tenantAppModule.yet){
        props.requestGetList();
        return       <CircularProgress />
    }
    if (props.loadSuccess===tenantAppModule.requested||props.deleteComplete===tenantAppModule.syncing){
        return       <CircularProgress />
    }
    if(props.loadSuccess===tenantAppModule.loadSuccess){
        return (
            <React.Fragment>
                <SuTechGrid title={"テナント一覧(" + props.operationType + ")"}
                            gridConf={gridConf} datas={props.datas}
                            goDetailHandler={props.selectGoToDetail}
                            selectToBase="/tenant/profile"
                            deleteHandler={props.requestDel}
                />
                <div>顧客は1000件以上いるわけだから、10件を一覧にするのはまじ意味ない・・・・</div>
                <FabLink to="/tenant/add" onClick={props.selectGoToAdd} />
            </React.Fragment>
        );
    }
    return <div>ERROE!!!!</div>
}

const mapStateToProps = state => {
    console.log('mapStateToProps ' + JSON.stringify(state));
    return {
        operationType  : state.operationType,
        loadSuccess : state.loadSuccess,
        deleteComplete:  state.deleteComplete,
        datas  : state.datas,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        requestGetList: () => dispatch(tenantAppModule.requestList()),
        requestDel: (id) => dispatch(tenantAppModule.requestDel(id)),
        selectGoToAdd: () => dispatch(tenantAppModule.selectGoToAdd()),
        selectGoToDetail: (data) => dispatch(tenantAppModule.selectGoToDetail(data)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantList);
