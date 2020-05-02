import React from "react";
import {Link, Route, useRouteMatch , Switch} from "react-router-dom";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {  makeStyles } from '@material-ui/core/styles';

import SuTechGrid from "../asset/SuTechGrid";
import TenantAdd from "./TenantAdd";
import TenantList from "./TenantList";
import TenantDetail from "./TenantDetail";




export default function TenantApp(props) {
    let { path, url } = useRouteMatch();
    console.log(props.selectGoToAdd)

    return (
        <React.Fragment>
            <div>props={props.operationType}</div>
            <Switch>
                <Route exact path={path + "/list"} render={TenantList}></Route>
                <Route exact path={path + "/add"} component={TenantAdd} ></Route>
                <Route exact path={path + "/detail"} component={TenantDetail} ></Route>
                <Route exact path={path + "/detail/:tenantId"} component={TenantDetail} ></Route>
                <Route exact path={path} component={TenantList} ></Route>
            </Switch>
        </React.Fragment>

    );
}
