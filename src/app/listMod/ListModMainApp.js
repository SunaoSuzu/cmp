import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import PageTitle from "../../components/PageTitle";
import Paper from "@material-ui/core/Paper";
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import {useDef} from "../AppProvider";
import listMod from "./components/ListModifyComponent"

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

const ListModApp = () => {
    const classes = useStyles();
    const { path } = useRouteMatch();
    const def = useDef();
    console.log("ListModApp:" + JSON.stringify(def));
    return (
        <React.Fragment>
            <div className={classes.appHeaderWrap}>
                <PageTitle>{def.title}</PageTitle>
            </div>
            <Paper elevation={3} className={classes.appContent}>
                <Switch>
                    <Redirect exact from={path} to={path + "/list"} />
                    <Route exact path={path + "/list"} component={listMod} />
                </Switch>
            </Paper>
        </React.Fragment>
    );
}
export default ListModApp