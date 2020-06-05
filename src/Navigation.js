import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Routes from "./Routes";
import { withRouter } from "react-router-dom";
import { isIOS, isMobile } from "react-device-detect";
import SignIn from "./signin/SignIn";

//自作
import SiteHeader from "./components/SiteHeader";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const Navigation = (props) => {
  const {
    selectHome,
    selectProfile,
    selectAccount,
    selectNotice,
    selectSearch,
    selectLogout,
    startMonitor
  } = props;

  const { functionType, selectedMenuId, selectedReportId,targetOperations } = props;
  const { selectMenu, selectReport } = props;

  const [monitor, setMonitor] = React.useState(false);

  if (isIOS && isMobile) {
    document.body.classList.add("ios-mobile-view-height");
  } else if (document.body.classList.contains("ios-mobile-view-height")) {
    document.body.classList.remove("ios-mobile-view-height");
  }

  const classes = useStyles();

  const authSuccess = function(uid){
    props.authSuccess(uid);
  }

  if(!props.authorized){
    return <SignIn authSuccess={authSuccess.bind()}/>;
  }else{
    if(monitor===false){
      startMonitor();
      setMonitor(true);
    }
    return (
        <React.StrictMode>
          <div className={classes.root}>
            <SiteHeader
                selectHome={selectHome}
                selectSearch={selectSearch}
                selectNotice={selectNotice}
                selectProfile={selectProfile}
                selectAccount={selectAccount}
                selectLogout={selectLogout}
                functionType={functionType}
                selectedMenuId={selectedMenuId}
                selectedReportId={selectedReportId}
                selectMenu={selectMenu}
                selectReport={selectReport}
                targetOperations={targetOperations}
            />
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container maxWidth="lg" className={classes.container}>
                <Routes />
              </Container>
            </main>
            {/* <SiteFooter/> */}
          </div>
        </React.StrictMode>
    );

  }

};

export default withRouter(Navigation);
