import React from "react";
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import Menu from "./menu/MenuDesigner";
import App from "./app/AppDesigner";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    tabPanel: {
        width: "100%"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    },
    resources: {
        width: "100%",
        backgroundColor: theme.palette.background.paper
    },
}));


const DesignerMainApp = (props) => {
    const { path } = useRouteMatch();
    return (
        <React.Fragment>
                <Switch>
                    <Redirect exact from={path} to={path + "/app"} />
                    <Route path={path + "/menu"} component={Menu} />
                    <Route path={path + "/app"} component={App} />
                </Switch>
        </React.Fragment>
    );
}
export default DesignerMainApp;