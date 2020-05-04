import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {makeStyles  } from "@material-ui/core/styles";
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import { Route,Redirect } from "react-router-dom";

//自作
import AppHeader from "./layout/AppHeader";
import ActivityApp from "./activity/ActivityApp";
import TenantSubApp from "./tenant/TenantSubApp";
import ProductApp from "./product/ProductApp";
import OperationApp from "./operation/OperationApp";
import ProfileApp from "./profile/ProfileApp";
import HomeApp from "./HomeApp";
import ReportApp from "./report/ReportApp";
import NoticeApp from "./notice/NoticeApp";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="http://www.sutech.co.jp/">
                SuTech
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2),
    },
}));

export default function Navigation(props)  {

    const { selectHome,selectProfile,selectAccount,selectNotice,selectSearch,selectLogout  } = props;

    const { functionType , selectedMenuId,selectedReportId } = props;
    const { selectMenu,selectReport  } = props;


    const classes=useStyles();
    console.log(props);

    return (
        <React.StrictMode>
            <div className={classes.root} >
                <CssBaseline />
                <AppHeader selectHome={selectHome} selectSearch={selectSearch} selectNotice={selectNotice}
                           selectProfile={selectProfile} selectAccount={selectAccount} selectLogout={selectLogout}
                           functionType={functionType} selectedMenuId={selectedMenuId} selectedReportId={selectedReportId}
                           selectMenu={selectMenu} selectReport={selectReport}/>
                <main className={classes.content}>
                    <Toolbar />
                    <Paper elevation={0}>
                        <Redirect exact from="/" to="/home"/>
                        <Route exact path="/" component={HomeApp}/>
                        <Route path="/home" component={HomeApp}/>
                        <Route path="/profile" component={ProfileApp}/>
                        <Route path="/notice" component={NoticeApp}/>
                        <Route path="/activity" component={ActivityApp}/>
                        <Route path="/tenant" component={TenantSubApp}/>
                        <Route path="/product" component={ProductApp}/>
                        <Route path="/operation" component={OperationApp}/>
                        <Route exact path="/report" component={ReportApp}/>
                        <Route path="/report/:reportId" component={ReportApp}/>
                    </Paper>
                    <Copyright/>
                </main>
            </div>
        </React.StrictMode>
    );
}

