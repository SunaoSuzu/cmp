import React from "react";
import {Link, Route, useRouteMatch , Switch} from "react-router-dom";
import NewTenant from "./NewTenant";
import TenantList from "./TenantList";
import TenantDetail from "./TenantProfile";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    appHeader: {
        padding: theme.spacing(1),
        margin: theme.spacing(2),
        position:'relative',
    },
    appHeaderWrap: {
        width : "100%",
        alignItems : "center",
        display: 'flex',
    },
    appTitle :{
        flexGrow: 1,
    },
    appBreadcrumbs :{
        textAlign: "right",
    },
    appContent: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function TenantApp(props) {
    const classes = useStyles();
    let { path } = useRouteMatch();

    let breadcrumbStack=props.breadcrumbStack;

    return (
        <React.Fragment>
            <Paper elevation={3} className={classes.appHeader}>
                <div className={classes.appHeaderWrap}>

                    <h2 className={classes.appTitle}>テナントプロファイル</h2>
                    <Breadcrumbs aria-label="breadcrumb" className={classes.appBreadcrumbs}>
                        {breadcrumbStack.map((step ) => (
                            <Link to={step.to} onClick={props.selectList} className={classes.appBreadcrumbs}>
                                {step.caption}
                            </Link>
                        ))}
                    </Breadcrumbs>
                </div>
            </Paper>
            <Paper elevation={3} className={classes.appContent}>
                <Switch>
                    <Route exact path={path + "/list"} component={TenantList} />
                    <Route exact path={path + "/add"} component={NewTenant} />
                    <Route exact path={path + "/profile"} component={TenantDetail} />
                    <Route exact path={path + "/profile/:tenantId"} component={TenantDetail} />
                    <Route exact path={path} component={TenantList} />
                </Switch>
            </Paper>
        </React.Fragment>

    );
}
