import React from "react";
import {Link, Route, useRouteMatch , Switch} from "react-router-dom";
import NewTenant from "./NewTenant";
import TenantList from "./TenantList";
import TenantDetail from "./TenantProfile";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';




export default function TenantApp(props) {
    let { path } = useRouteMatch();

    let breadcrumbStack=props.breadcrumbStack;

    return (
        <React.Fragment>
            <Breadcrumbs aria-label="breadcrumb">
                {breadcrumbStack.map((step ) => (
                    <Link to={step.to} onClick={props.selectList}>
                        {step.caption}
                    </Link>
                ))}
            </Breadcrumbs>
            <Switch>
                <Route exact path={path + "/list"} component={TenantList} />
                <Route exact path={path + "/add"} component={NewTenant} />
                <Route exact path={path + "/profile"} component={TenantDetail} />
                <Route exact path={path + "/profile/:tenantId"} component={TenantDetail} />
                <Route exact path={path} component={TenantList} />
            </Switch>
        </React.Fragment>

    );
}
