import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles  } from "@material-ui/core/styles";
import Toolbar from '@material-ui/core/Toolbar';
import Routes from "./Routes";
import { withRouter } from "react-router";

//自作
import SiteHeader from "./layout/SiteHeader";
import SiteFooter from "./layout/SiteFooter";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection : "column"
    },
    content: {
        flexGrow: 1,
        bgcolor : theme.palette.background
    },
    appWhole: {
        padding: theme.spacing(1),
    },
}));


const Navigation = (props) => {

    const { selectHome,selectProfile,selectAccount,selectNotice,selectSearch,selectLogout  } = props;

    const { functionType , selectedMenuId,selectedReportId } = props;
    const { selectMenu,selectReport  } = props;


    const classes=useStyles();
    return (
        <React.StrictMode>
            <div className={classes.root} >
                <CssBaseline />
                <SiteHeader selectHome={selectHome} selectSearch={selectSearch} selectNotice={selectNotice}
                            selectProfile={selectProfile} selectAccount={selectAccount} selectLogout={selectLogout}
                            functionType={functionType} selectedMenuId={selectedMenuId} selectedReportId={selectedReportId}
                            selectMenu={selectMenu} selectReport={selectReport}/>
                <main className={classes.content}>
                    <Toolbar />
                    <div className={classes.appWhole}>
                        <Routes />
                    </div>
                </main>
                <SiteFooter/>
            </div>
        </React.StrictMode>
    );
}

export default withRouter(Navigation);
