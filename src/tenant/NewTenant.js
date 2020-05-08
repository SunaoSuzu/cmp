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
        if(props.newData.name===undefined){
            //HOT DEPLOYで進められるようにする
            props.selectGoToAdd();
            return <CircularProgress/>;
        }

        return <NewTenantPage addComplete={props.addComplete}
                              changePropertyOfNew={props.changePropertyOfNew}
                              requestAdd={props.requestAdd}
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
        selectGoToAdd:() => dispatch(tenantAppModule.selectGoToAdd()),
        requestAdd: (e) => dispatch(tenantAppModule.requestAdd(e)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTenant);
