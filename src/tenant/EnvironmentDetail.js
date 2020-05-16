import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "@material-ui/core/Button";
import StorageIcon from "@material-ui/icons/Storage";
import React from "react";
import getConfiguration from "../Configuration";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import VpcLogo from "../components/VpcLogo";
import EC2Logo from "../components/EC2Logo";
import * as TenantAppModule from "./TenantAppModule";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CodeIcon from "@material-ui/icons/Code";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  formControl: {
    margin: theme.spacing(1),
    alignItems: "center",
    minWidth: 120,
  },
  componentPane: {
    width: "100%",
  },
  tabPanel: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  resources: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(3),
  },
  doubleNested: {
    paddingLeft: theme.spacing(4),
  },
}));

const EnvironmentDetail = (props) => {
  const classes = useStyles();
  const conf = getConfiguration();
  const environmentVpcTypeMst = conf.environmentVpcTypeMst;
  const environmentStatusMst = conf.environmentStatusMst;

  const index = props.index;
  const env = props.env;
  const uiToJson = props.uiToJson;
  const attachAws = props.attachAws;
  const tenant = props.tenant;
  const attachedAwsInfo = props.attachedAwsInfo;
  const attachAwsCompleted = props.attachAwsCompleted;
  const requestGetOperation = props.requestGetOperation;
  const requestInvokeOperation = props.requestInvokeOperation;
  const requestResetOperation = props.requestResetOperation;

  //for tab
  const [innerTabValue, setInnerTavLavlue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setInnerTavLavlue(newValue);
  };

  const attach = function attach(t, e, i) {
    attachAws(t.awsTag, e.awsTag);
    //        attachAws("cmp-tenant-stech" , "develop" );
  };

  const getOperation = function getOperation(t, e, i) {
    console.log("getOperation");
    requestGetOperation(t, e, i);
  };

  const invokeOperation = function getOperation(t, e, i) {
    console.log("invokeOperation");
    requestInvokeOperation(t, e, i);
  };

  const resetOperation = function getOperation(t, e, i) {
    console.log("invokeOperation");
    requestResetOperation(t, e, i);
  };

  if (attachAwsCompleted === TenantAppModule.loadSuccess) {
    console.log("AWSから取り込み成功");
  }

  function getName(tags) {
    let retVal = "";
    tags.map((tag) => {
      if (tag.Key === "Name") {
        retVal = tag.Value;
      }
    });
    return retVal;
  }

  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={innerTabValue}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="基礎情報" {...a11yProps(0)} />
            <Tab label="AWS" {...a11yProps(1)} />
            <Tab label="パラメータ" {...a11yProps(2)} />
            <Tab label="作業" {...a11yProps(3)} />
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
              required: true,
            }}
            value={env.awsTag}
          />
          <FormControl className={classes.formControl}>
            <InputLabel shrink id="environment-status-label">
              ステータス
            </InputLabel>
            <Select
              name={"environments." + index + ".status"}
              onChange={uiToJson}
              id="standard-env-status"
              value={env.status}
              inputProps={{
                readOnly: true,
              }}
              margin="dense"
              labelId="environment-status-label"
            >
              {environmentStatusMst.map((status) => (
                <MenuItem value={status.id} key={status.id}>
                  {status.caption}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>ステータス</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel shrink id="standard-env-vpc-type-label">
              VPC方針
            </InputLabel>
            <Select
              name={"environments." + index + ".vpcType"}
              onChange={uiToJson}
              id="standard-env-vpc-type"
              value={env.vpcType}
              inputProps={{
                readOnly: true,
              }}
              margin="dense"
              labelId="standard-env-vpc-type-label"
            >
              {environmentVpcTypeMst.map((vpc) => (
                <MenuItem value={vpc.id} key={vpc.id}>
                  {vpc.caption}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>VPC作成方針</FormHelperText>
          </FormControl>
          <TextField
            name={"environments." + index + ".specLevel"}
            onChange={uiToJson}
            id="standard-env-spec-level"
            label="SPECレベル"
            value={env.specLevel}
            inputProps={{
              readOnly: true,
            }}
            margin="dense"
            helperText="SPECレベル"
          />
        </TabPanel>
        <TabPanel
          value={innerTabValue}
          index={1}
          boxShadow={1}
          className={classes.tabPanel}
        >
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<StorageIcon />}
            onClick={() => getOperation(tenant, env, index)}
          >
            構成決定
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<StorageIcon />}
            onClick={() => attach(tenant, env, index)}
          >
            アタッチ
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<StorageIcon />}
            onClick={() => invokeOperation(tenant, env, index)}
          >
            作業実行
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<StorageIcon />}
            onClick={() => resetOperation(tenant, env, index)}
          >
            破棄
          </Button>
          {env.resources != null ? (
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              className={classes.resources}
            >
              <ListItem button>
                <ListItemIcon>
                  <VpcLogo />
                </ListItemIcon>
                <ListItemText primary={"vpc=" + env.resources.vpcName} />
                <ListItemText primary={"add=" + env.resources.add} />
                <ListItemText primary={"attached=" + env.resources.attached} />
                {env.resources.tags.map((tag, t) => (
                  <ListItemText
                    primary={"t:" + tag.name + "=" + tag.value}
                    key={t}
                  />
                ))}
              </ListItem>
              {env.resources.ec2.map((instance, ei) => (
                <List component="div" disablePadding key={ei}>
                  <ListItem button className={classes.nested}>
                    <ListItemIcon>
                      <EC2Logo />
                    </ListItemIcon>
                    <ListItemText primary={"type=" + instance.instanceType} />
                    <ListItemText primary={"add=" + instance.add} />
                    <ListItemText primary={"attached=" + instance.attached} />
                    {instance.tags.map((tag, t) => (
                      <ListItemText
                        key={t}
                        primary={"t:" + tag.name + "=" + tag.value}
                      />
                    ))}
                  </ListItem>
                  {instance.components.map((component, ci) => (
                    <List component="div" disablePadding key={ci}>
                      <ListItem button className={classes.doubleNested}>
                        <ListItemIcon>
                          <CodeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"name=" + component.name} />
                      </ListItem>
                    </List>
                  ))}
                </List>
              ))}
            </List>
          ) : (
            ""
          )}

          {attachAwsCompleted === TenantAppModule.loadSuccess
            ? attachedAwsInfo.vpcs.map((vpc, v) => (
                <React.Fragment key={v}>
                  <Divider />
                  <div>
                    <VpcLogo />
                    {getName(vpc.Tags)} {vpc.VpcId}
                  </div>
                </React.Fragment>
              ))
            : ""}
          {attachAwsCompleted === TenantAppModule.loadSuccess
            ? attachedAwsInfo.ec2.map((ec2, ei) => (
                <React.Fragment ket={ei}>
                  {ec2.Instances.map((instance, ii) => (
                    <React.Fragment key={ii}>
                      <div>
                        <EC2Logo />
                        {getName(instance.Tags)} {instance.InstanceId}{" "}
                        {instance.InstanceType}
                      </div>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))
            : ""}
        </TabPanel>
        <TabPanel
          value={innerTabValue}
          index={2}
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default EnvironmentDetail;
