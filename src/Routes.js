import React from "react";
import { Redirect, Route, Switch,useRouteMatch } from "react-router-dom";
import { withRouter } from "react-router";
import HomeApp from "./HomeApp";
import ProfileApp from "./profile/ProfileApp";
import NoticeApp from "./notification/NoticeApp";
import ActivityApp from "./activity/ActivityApp";
import TenantSubApp from "./tenant/TenantSubApp";
import ProductApp from "./product/ProductApp";
import OperationSubApp from "./operation/OperationSubApp";
import ReportApp from "./report/ReportApp";
import AwsSubApp from "./aws/AwsSubApp";
import DesignerApp from "./designer/DesignerMainApp"


const Routes = ({ match }) => (
  <Switch>
    <Redirect exact from="/" to="/home" />
    <Redirect exact from="/login" to="/home" />
    <Route path={`${match.url}home`} component={HomeApp} />
    <Route path={`${match.url}profile`} component={ProfileApp} />
    <Route path={`${match.url}notice`} component={NoticeApp} />
    <Route path={`${match.url}activity/:appId`} component={ActivityApp} />
    <Route path={`${match.url}tenant/:appId`} component={TenantSubApp} />
    <Route path={`${match.url}product/:appId`} component={ProductApp} />
    <Route path={`${match.url}operation/:appId`} component={OperationSubApp} />
    <Route path={`${match.url}designer/:appId`} component={DesignerApp} />
    <Route path={`${match.url}report/:reportId`} component={ReportApp} />
    <Route path={`${match.url}aws`} component={AwsSubApp} />
  </Switch>
);

export default withRouter(Routes);
