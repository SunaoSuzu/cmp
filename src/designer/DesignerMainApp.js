import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import AppsIcon from '@material-ui/icons/Apps';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import {Link as RouterLink, Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import Menu from "./menu/MenuDesigner";
import App from "./app/AppDesigner";
import GroupIcon from '@material-ui/icons/Group';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    root: {
        width: 500,
    },
});

export default function SimpleBottomNavigation() {
    const classes = useStyles();
    const [value, setValue] = React.useState("app");
    const { path } = useRouteMatch();

    return (
        <React.Fragment>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction label="Apps" icon={<AppsIcon />} value="app"
                                        component={RouterLink} to="../app/list"/>
                <BottomNavigationAction label="Menus" icon={<VpnKeyIcon />} value="menu"
                                        component={RouterLink} to="../menu/list"/>
                <BottomNavigationAction label="User" icon={<GroupIcon />} value="user"/>
            </BottomNavigation>
            <Switch>
                <Redirect exact from={path} to={path + "/app/list"} />
                <Route path={path + "/app"} component={App} />
                <Route path={path + "/menu"} component={Menu} />
            </Switch>
        </React.Fragment>
    );
}
