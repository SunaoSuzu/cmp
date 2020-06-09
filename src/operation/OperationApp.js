import React from "react";
import OperationList from "./OperationList";
import PageTitle from "../components/PageTitle";
import Paper from "@material-ui/core/Paper";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
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

const OperationApp = props => {
    const classes = useStyles();
    let { path } = useRouteMatch();
    return (
        <React.Fragment>
            <div className={classes.appHeaderWrap}>
                <PageTitle>オペレーション一覧</PageTitle>
            </div>
            <Paper elevation={3} className={classes.appContent}>
                <Switch>
                    <Route exact path={path + "/list"} component={OperationList} />
                </Switch>
            </Paper>
        </React.Fragment>
    );
}
export default OperationApp;