import React from "react";
import {Route, useRouteMatch, Switch, Redirect} from "react-router-dom";
import NewTenant from "./NewTenant";
import TenantList from "./TenantList";
import TenantDetail from "./TenantProfile";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../components/PageTitle";

const useStyles = makeStyles(theme => ({
  appHeader: {
    padding: theme.spacing(1),
    margin: theme.spacing(2),
    position: "relative"
  },
  appHeaderWrap: {
    width: "100%",
    alignItems: "center",
    display: "flex"
  },
  appTitle: {
    flexGrow: 1
  },
  appBreadcrumbs: {
    textAlign: "right"
  },
  appContent: {
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch"
    }
  }
}));

export default function TenantApp() {
  const classes = useStyles();
  let { path } = useRouteMatch();

  console.log("path=" + path);

  return (
      <React.Fragment>
        <div className={classes.appHeaderWrap}>
          <PageTitle>テナントプロファイル</PageTitle>
        </div>
        <Paper elevation={3} className={classes.appContent}>
          <Switch>
            <Redirect exact from={path} to={path + "/list"} />
            <Route exact path={path + "/list"} component={TenantList} />
            <Route exact path={path + "/add"} component={NewTenant} />
            <Route exact path={path + "/profile"} component={TenantDetail} />
            <Route
                exact
                path={path + "/profile/:tenantId"}
                component={TenantDetail}
            />
          </Switch>
        </Paper>
      </React.Fragment>
  );
}
