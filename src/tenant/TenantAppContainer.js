import { connect } from 'react-redux';
import * as tenantAppModule from './TenantAppModule';
import TenantApp from "./TenantApp";

const mapStateToProps = state => {
    console.log('mapStateToProps ' + JSON.stringify(state))
    return {
        operationType  : state.operationType,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        selectList: () => dispatch(tenantAppModule.selectList()),
        selectGoToAdd: () => dispatch(tenantAppModule.selectGoToAdd()),
        selectGoToDetail: (data) => dispatch(tenantAppModule.selectGoToDetail(data)),
        updateData: (data) => dispatch(tenantAppModule.updateData(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TenantApp);
