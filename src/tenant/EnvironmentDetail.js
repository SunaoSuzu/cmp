import TextField from "@material-ui/core/TextField";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import React from "react";
import getConfiguration from "../Configuration";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import AWSPanel from "./env/AWSPanel";
import ComponentPanel from "./env/ComponentPanel";
import BasicInfoPanel from "./env/BasicInfoPanel";

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
  const uiToJson = props.uiToJson;
  const tenant = props.tenant;

  //for tab
  const [innerTabValue, setInnerTavLavlue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setInnerTavLavlue(newValue);
  };

  return (
    <React.Fragment>
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
                            "environments." +
                            index +
                            ".mainComponents." +
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
export default EnvironmentDetail;
