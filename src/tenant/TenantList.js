import React from "react";
import SuTechGrid from "../asset/SuTechGrid";
import * as tenantAppModule from "./TenantAppModule";
import {connect} from "react-redux";

import getConfiguration from "../Configuration";

function TenantList(props) {
    const conf = getConfiguration();
    const gridConf = conf.tenantListGridConf;
    return (
        <React.Fragment>
            <SuTechGrid title={"テナント一覧(" + props.operationType + ")"} gridConf={gridConf} datas={props.datas}
                        goDetailHandler={props.selectGoToDetail}
                        goAddHandler={props.selectGoToAdd}
            />
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    console.log('mapStateToProps ' + JSON.stringify(state));
    return {
        operationType  : state.operationType,
        datas  : state.datas,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        selectList: () => dispatch(tenantAppModule.selectList()),
        selectGoToAdd: () => dispatch(tenantAppModule.selectGoToAdd()),
        selectGoToDetail: (data) => dispatch(tenantAppModule.selectGoToDetail(data)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantList);
