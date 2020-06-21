import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import PageTitle from "../components/PageTitle";
import Paper from "@material-ui/core/Paper";
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import {useDef} from "./AppProvider";
import Add from "./components/AddComponent";
import list from "./components/ListComponent";
import listModify from "./components/ListModifyComponent";
import profile from "./components/ProfileComponent";
import {useSelector} from "react-redux";
import ActionProgress from "../components/ActionProgress";

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

const MainApp = () => {
    const classes = useStyles();
    const { path } = useRouteMatch();
    const def = useDef();
    const blocking = useSelector(state => state.ui.blocking);
    const BLOCK = blocking ? <ActionProgress/> : "";


    return (
        <React.Fragment>
            {BLOCK}
            <div className={classes.appHeaderWrap}>
                <PageTitle>{def.title}</PageTitle>
            </div>
            <Paper elevation={3} className={classes.appContent}>
                <Switch>
                    <Redirect exact from={path} to={path + "/list"} />
                    <Redirect exact from={path + "/profile"} to={path + "/list"} />
                    <Route exact path={path + "/list"} component={list} />
                    <Route exact path={path + "/listModify"} component={listModify} />
                    <Route exact path={path + "/profile/:id"} component={profile} />
                    <Route exact path={path + "/add"} component={Add} />
                </Switch>
            </Paper>
        </React.Fragment>
    );
}
export default MainApp