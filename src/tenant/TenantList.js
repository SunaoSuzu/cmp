import React from "react";
import SuTechGrid from "../asset/SuTechGrid";
import * as tenantAppModule from "./TenantAppModule";
import {connect} from "react-redux";

function TenantList(props) {
    return (
        <React.Fragment>
            <SuTechGrid title="テント" gridConf={props.gridConf} datas={props.datas}
                        goDetailHandler={props.selectGoToDetail}
                        goAddHandler={props.selectGoToAdd}
            ></SuTechGrid>
        </React.Fragment>

        );
}

const mapStateToProps = state => {
    console.log('mapStateToProps ' + JSON.stringify(state))
    return {
        operationType  : state.operationType,
        datas  : state.datas,
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

export default connect(mapStateToProps, mapDispatchToProps)(TenantList);
