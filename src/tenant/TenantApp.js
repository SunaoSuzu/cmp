import React from "react";
import {Link, Route, useRouteMatch , Switch} from "react-router-dom";
import NewTenent from "./NewTenent";
import TenantList from "./TenantList";
import TenantDetail from "./TenantProfile";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';




export default function TenantApp(props) {
    let { path } = useRouteMatch();

    return (
        <React.Fragment>
            <Breadcrumbs aria-label="breadcrumb">
                {props.breadcrumbStack.map((step ) => (
                    <Link to={step.to}>
                        {step.caption}
                    </Link>
                ))}
            </Breadcrumbs>
            <Switch>
                <Route exact path={path + "/list"} component={TenantList} />
                <Route exact path={path + "/add"} component={NewTenent} />
                <Route exact path={path + "/profile"} component={TenantDetail} />
                <Route exact path={path + "/profile/:tenantId"} component={TenantDetail} />
                <Route exact path={path} component={TenantList} />
            </Switch>
        </React.Fragment>

    );
}
