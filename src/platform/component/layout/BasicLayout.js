import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import PageTitle from "../../../components/PageTitle";
import Paper from "@material-ui/core/Paper";
import ActionProgress from "../../../components/ActionProgress";

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

const BasicLayout = ({title="名無し", children,blocking=false}) => {
    const classes = useStyles();
    const BLOCK = blocking ? <ActionProgress/> : "";
    return (
        <React.Fragment>
            {BLOCK}
            <div className={classes.appHeaderWrap}>
                <PageTitle>{title}</PageTitle>
            </div>
            <Paper elevation={3} className={classes.appContent}>
                {children}
            </Paper>
        </React.Fragment>

    );

}
export default BasicLayout;