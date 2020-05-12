import NewTenantPage from "./NewTenentPage";
import * as tenantAppModule from "./TenantAppModule";
import ActionProgress from "../components/ActionProgress";
import React from "react";
import { Redirect } from 'react-router-dom';
import {connect} from "react-redux";

function NewTenant(props) {

    if(props.addComplete === tenantAppModule.syncing) {
        return <ActionProgress/>
    }else if (props.addComplete === tenantAppModule.synced){
        return <Redirect to={'/tenant/profile/' + props.newData.id} />
    }else{
        if(props.newData.name===undefined){
            //HOT DEPLOYで進められるようにする
            props.selectGoToAdd();
            return <ActionProgress />;
        }

        return <NewTenantPage addComplete={props.addComplete}
                              changePropertyOfNew={props.changePropertyOfNew}
                              pushEmptyForNew={props.pushEmptyForNew}
                              delFromArrayForNew={props.delFromArrayForNew}
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
        selectGoToAdd:() => dispatch(tenantAppModule.selectGoToAdd()),
        requestAdd: (e) => dispatch(tenantAppModule.requestAdd(e)),
        changePropertyOfNew: (e) => dispatch(tenantAppModule.changePropertyOfNew(e)),
        pushEmptyForNew: (path,empty) => dispatch(tenantAppModule.pushEmptyForNew(path,empty)),
        delFromArrayForNew: (path,index) => dispatch(tenantAppModule.delFromArrayForNew(path,index)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTenant);
