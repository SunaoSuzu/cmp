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
            <div>顧客は1000件以上いるわけだから、10件を一覧にするのはまじ意味ない・・・・</div>
            <SuTechGrid title={"テナント一覧(" + props.operationType + ")"} gridConf={gridConf} datas={props.datas}
                        goDetailHandler={props.selectGoToDetail}
                        goAddHandler={props.selectGoToAdd}
                        selectToBase="/tenant/profile"
                        addToBase="/tenant/add"
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
