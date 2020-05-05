import NewTenantPage from "./NewTenentPage";
import {connect} from "react-redux";
import * as tenantAppModule from "./TenantAppModule";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import { Redirect } from 'react-router-dom';

function NewTenant(props) {

    if(props.addComplete === tenantAppModule.syncing) {
        return <CircularProgress/>
    }else if (props.addComplete === tenantAppModule.synced){
        return <Redirect to={'/tenant/profile/' + props.newData.id} />
    }else{
        return <NewTenantPage addComplete={props.addComplete}
                              changePropertyOfNew={props.changePropertyOfNew}
                              addData={props.addData}
                              newData={props.newData}
        />;
    }

}


const mapStateToProps = state => {
    return {
        getDetailComplete : state.getDetailComplete,
        addComplete : state.addComplete,
        newData : state.newData,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePropertyOfNew: (e) => dispatch(tenantAppModule.changePropertyOfNew(e)),
        addData: (e) => dispatch(tenantAppModule.addData(e)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTenant);
