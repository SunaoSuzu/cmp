import TextField from "@material-ui/core/TextField";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import React, {useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../../components/TabPanel";
import AWSPanel from "./AWSPanel";
import ComponentPanel from "./ComponentPanel";
import BasicInfoPanel from "./BasicInfoPanel";
import { connect } from "react-redux";
import {changeEnvProperty,startSubscribe,stopSubscribe,acceptChange} from "../module/EnvironmentModule";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  formControl: {
    margin: theme.spacing(1),
    // alignItems: "center",
    minWidth: 120
  },
  componentPane: {
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
  nested: {
    paddingLeft: theme.spacing(3)
  },
  doubleNested: {
    paddingLeft: theme.spacing(4)
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const EnvironmentDetail = props => {
  const classes = useStyles();

  const index = props.index;
  const env = props.env;
  const changeEnvProperty = props.changeEnvProperty;
  const tenant = props.tenant;

  const uiToJson = event => {
    changeEnvProperty(event,index);
  };

  useEffect(()=>{
    props.startSubscribe(tenant,env,index);
    return () => {
      props.stopSubscribe(tenant,env,index);
    }
  },[env,env.status])

  //for tab
  const [innerTabValue, setInnerTavLavlue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setInnerTavLavlue(newValue);
  };
  return (
    <React.Fragment>
      <Dialog open={props.showFoundMessage} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">処理の終了を検知しました</DialogTitle>
        <DialogContent>
          <DialogContentText>
            処理の終了を検知しました、画面を最新化をします
          </DialogContentText>
          <TextField
              margin="dense"
              id="region"
              label="Region"
              defaultValue="ap-northeast-1"
              inputProps={{
                readOnly: true,
                required: true,
              }}
              fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button id="diagButton" onClick={() => props.acceptChange(tenant, env, index)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>



      <div className={classes.root}>
        <AppBar position="static" color="default" elevation={0}>
          <Tabs
            value={innerTabValue}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="基礎情報" {...a11yProps(0)} />
            {env.mainComponents.map((component, c) => (
                <Tab label={component.name} {...a11yProps((c + 1))} key={c} />
            ))}
            <Tab label="AWS" {...a11yProps((1 + env.mainComponents.length))} />
            <Tab label="パラメータ" {...a11yProps((2 + env.mainComponents.length))} />
          </Tabs>
        </AppBar>
        <TabPanel
          value={innerTabValue}
          index={0}
          boxShadow={1}
          className={classes.tabPanel}
        >
          <BasicInfoPanel
              index = {index}
              env = {env}
              uiToJson = {uiToJson}
              tenant = {tenant}
          />
        </TabPanel>
        {env.mainComponents.map((component, c) => (
            <TabPanel value={innerTabValue}
                      index={c + 1}
                      boxShadow={1}
                      className={classes.tabPanel}
                      key={c}
            >
              <ComponentPanel targetComponent={component}
                              cindex={c} index={index}
                              env={env} tenant={tenant}/>
            </TabPanel>
        ))}
        <TabPanel
          value={innerTabValue}
          index={(1 + env.mainComponents.length)}
          boxShadow={1}
          className={classes.tabPanel}
        >
          <AWSPanel env={env} tenant={tenant} index={index} />
        </TabPanel>
        <TabPanel
          value={innerTabValue}
          index={(2 + env.mainComponents.length)}
          boxShadow={1}
          className={classes.tabPanel}
        >
          {env.mainComponents.map((component, c) => (
            <div className={classes.componentPane} key={c}>
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    {component.name}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  {component.params != null
                    ? component.params.map((param, i) => (
                        <TextField
                          name={
                            "mainComponents." +
                            c +
                            ".params." +
                            i +
                            ".now"
                          }
                          onChange={uiToJson}
                          id={"standard-env-params-" + i}
                          label={param.caption}
                          value={param.now}
                          inputProps={{}}
                          key={i}
                          margin="dense"
                          helperText={param.caption}
                        />
                      ))
                    : ""}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          ))}
        </TabPanel>
      </div>
    </React.Fragment>
  );
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const mapStateToProps = (state) => {
  return {
    showFoundMessage : state.env.showFoundMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeEnvProperty: (e,index) => dispatch(changeEnvProperty(e,index)),
    startSubscribe: (tenant, env, envIndex) => dispatch(startSubscribe(tenant, env, envIndex)),
    stopSubscribe: (tenant, env, envIndex) => dispatch(stopSubscribe(tenant, env, envIndex)),
    acceptChange: (tenant, env, envIndex) => dispatch(acceptChange(tenant, env, envIndex)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentDetail);
