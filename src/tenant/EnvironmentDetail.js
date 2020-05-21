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
import Selection from "../components/Selection";
import AWSPanel from "./aws/AWSPanel";
import ComponentPanel from "./aws/ComponentPanel";

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
  const conf = getConfiguration();
  const environmentVpcTypeMst = conf.environmentVpcTypeMst;
  const environmentStatusMst = conf.environmentStatusMst;

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
          <TextField
            name={"environments." + index + ".name"}
            onChange={uiToJson}
            id="standard-env-name"
            label="環境名"
            value={env.name}
            margin="dense"
            helperText="環境名を入れてください"
          />
          <TextField
            name={"environments." + index + ".awsTag"}
            onChange={uiToJson}
            id="standard-env-awsTag"
            label="tag(aws)"
            helperText="tag(aws)を入れてください"
            inputProps={{
              required: true
            }}
            value={env.awsTag}
          />
          <Selection input={true}
                     label="環境状態"
                     name={"environments." + index + ".status"}
                     onChange={uiToJson}
                     id="standard-basic-status"
                     value={env.status}
                     readOnly={true}
                     helperText="環境状態"
                     margin="dense"
                     options={environmentStatusMst}
          />
          <Selection input={true}
                     label="VPC方針"
                     name={"environments." + index + ".vpcType"}
                     onChange={uiToJson}
                     id="standard-basic-vpc-type"
                     value={env.vpcType}
                     readOnly={true}
                     helperText="VPC方針"
                     margin="dense"
                     options={environmentVpcTypeMst}
          />
          <TextField
            name={"environments." + index + ".specLevel"}
            onChange={uiToJson}
            id="standard-env-spec-level"
            label="SPECレベル"
            value={env.specLevel}
            inputProps={{
              readOnly: true
            }}
            margin="dense"
            helperText="SPECレベル"
          />
        </TabPanel>
        {env.mainComponents.map((component, c) => (
            <TabPanel value={innerTabValue}
                      index={c + 1}
                      boxShadow={1}
                      className={classes.tabPanel}
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
