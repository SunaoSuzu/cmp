import React from "react";
import {Link, Route, useRouteMatch , Switch} from "react-router-dom";
import TenantAdd from "./TenantAdd";
import TenantList from "./TenantList";
import TenantDetail from "./TenantDetail";
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
                <Route exact path={path + "/add"} component={TenantAdd} />
                <Route exact path={path + "/detail"} component={TenantDetail} />
                <Route exact path={path + "/detail/:tenantId"} component={TenantDetail} />
                <Route exact path={path} component={TenantList} />
            </Switch>
        </React.Fragment>

    );
}
