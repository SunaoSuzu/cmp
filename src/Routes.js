import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import HomeApp from "./HomeApp";
import ProfileApp from "./profile/ProfileApp";
import NoticeApp from "./notice/NoticeApp";
import ActivityApp from "./activity/ActivityApp";
import TenantSubApp from "./tenant/TenantSubApp";
import ProductApp from "./product/ProductApp";
import OperationApp from "./operation/OperationApp";
import ReportApp from "./report/ReportApp";
import AwsSubApp from "./aws/AwsSubApp";

const Routes = ({ match }) => (
  <Switch>
    <Redirect exact from="/" to="/home" />
    <Route path={`${match.url}home`} component={HomeApp} />
    <Route path={`${match.url}profile`} component={ProfileApp} />
    <Route path={`${match.url}notice`} component={NoticeApp} />
    <Route path={`${match.url}activity`} component={ActivityApp} />
    <Route path={`${match.url}tenant`} component={TenantSubApp} />
    <Route path={`${match.url}product`} component={ProductApp} />
    <Route path={`${match.url}operation`} component={OperationApp} />
    <Route exact path={`${match.url}report`} component={ReportApp} />
    <Route path={`${match.url}report/:reportId`} component={ReportApp} />
    <Route path={`${match.url}aws`} component={AwsSubApp} />
  </Switch>
);

export default withRouter(Routes);
