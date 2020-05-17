import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import Divider from "@material-ui/core/Divider";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import StorageIcon from "@material-ui/icons/StorageOutlined";
import ContractDetails from "./ContractDetails";
import Badge from "@material-ui/core/Badge";
import getConfiguration from "../Configuration";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import EnvironmentDetail from "./EnvironmentDetail";
import TabPanel from "./TabPanel";
import Box from "@material-ui/core/Box";

//将来的にItemDetaiPageと統合したいけど、難しそう
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    // alignItems: "center",
    minWidth: 120,
  },
  basicInformationPanel: {
    margin: theme.spacing(0),
    alignItems: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
  tabRoot: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 800,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  sideTab: {
    width: "100%",
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabPanel: {
    padding: theme.spacing(1, 2),
    flexGrow: 1,
    "& .MuiBox-root": {
      boxShadow: "none",
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function TenantProfilePage(props) {
  const conf = getConfiguration();
  const tenantStatusMst = conf.tenantStatusMst;
  const tenantVpcTypeMst = conf.tenantVpcTypeMst;
  const classes = useStyles();
  const { requestUpdate, changeProperty, attachAws } = props;

  const [tabValue, setValue] = React.useState(0);

  const handleChange = (event, newTabValue) => {
    setValue(newTabValue);
  };

  //ここで新規登録画面との変数名の違いを吸収
  const targetData = props.data;
  const save = function save() {
    requestUpdate(props.data);
  };
  const uiToJson = (event) => {
    changeProperty(event);
  };
  const delDetail = function addDetail(path, index) {
    props.delFromArray(path, index);
  };
  const addDetail = function addDetail(path, empty) {
    props.pushEmpty(path, empty);
  };
  const newEnv = function newEnv() {
    props.requestNewEnv(targetData);
  };
  return (
    <React.Fragment>
      <form encType="multipart/form-data">
        <div style={{ width: "100%" }}>
          <Box display="flex" p={0} bgcolor="background.paper">
            <Box p={0} flexGrow={1} bgcolor="background.toolbar" />
            <Box p={0} bgcolor="background.toolbar">
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
                onClick={save.bind(this)}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<StorageIcon />}
                onClick={newEnv.bind(this)}
              >
                新規環境
              </Button>
            </Box>
          </Box>
        </div>

        <div className={classes.basicInformationPanel}>
          <TextField
            name="name"
            onChange={uiToJson}
            id="standard-basic"
            label="テナント名"
            value={targetData.name}
            helperText="会社名を入れてください"
            inputProps={{
              required: true,
            }}
          />
          <TextField
            name="alias"
            onChange={uiToJson}
            id="standard-basic-alias"
            label="略称"
            value={targetData.alias}
            helperText="略称を入れてください"
            inputProps={{
              required: true,
            }}
          />
          <TextField
            name="awsTag"
            onChange={uiToJson}
            id="standard-basic-awsTag"
            label="tag(aws)"
            helperText="tag(aws)を入れてください"
            value={targetData.awsTag}
            inputProps={{
              required: true,
            }}
          />
          <FormControl className={classes.formControl}>
            <InputLabel shrink id="standard-basic-status-label">
              ステータス
            </InputLabel>
            <Select
              name="status"
              onChange={uiToJson}
              id="standard-basic-status"
              value={targetData.status}
              inputProps={{
                readOnly: true,
              }}
              label="ステータス"
              helperText="ステータス"
              labelId="standard-basic-status-label"
            >
              {tenantStatusMst.map((statusMst) => (
                <MenuItem value={statusMst.id} key={statusMst.id}>
                  {statusMst.caption}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>ステータス</FormHelperText>
          </FormControl>
        </div>
        <Divider />
        <div className={classes.tabRoot}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabValue}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab
              label="契約内容"
              {...a11yProps(0)}
              icon={<AssignmentIcon />}
              wrapped
              className={classes.sideTab}
            />
            <Tab
              label="環境方針"
              {...a11yProps(1)}
              icon={<AssignmentIcon />}
              wrapped
              className={classes.sideTab}
            />
            {targetData.environments.map((env, index) => (
              <Tab
                label={env.name}
                {...a11yProps(index + 2)}
                icon={
                  env.status === 1 ? (
                    <Badge
                      badgeContent="draft"
                      color="primary"
                      anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    >
                      <StorageIcon />
                    </Badge>
                  ) : (
                    <StorageIcon />
                  )
                }
                className={classes.sideTab}
                key={index}
              />
            ))}
          </Tabs>
          <TabPanel className={classes.tabPanel} value={tabValue} index={0}>
            <ContractDetails
              targetData={targetData}
              uiToJson={uiToJson}
              addDetail={addDetail}
              delDetail={delDetail}
            />
          </TabPanel>
          <TabPanel className={classes.tabPanel} value={tabValue} index={1}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink id="environment-setting-vpc-label">
                VPC方針
              </InputLabel>
              <Select
                name="status"
                onChange={uiToJson}
                id="environment-setting-vpc"
                value={targetData.environmentSetting.vpcType}
                inputProps={{
                  readOnly: true,
                }}
                label="VPC方針"
                helperText="VPC方針"
                margin="dense"
                labelId="environment-setting-vpc-label"
              >
                {tenantVpcTypeMst.map((vpc) => (
                  <MenuItem value={vpc.id} key={vpc.id}>
                    {vpc.caption}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>VPC作成方針</FormHelperText>
            </FormControl>
          </TabPanel>
          {targetData.environments.map((env, index) => (
            <TabPanel
              className={classes.tabPanel}
              value={tabValue}
              index={index + 2}
              key={index}
            >
              <EnvironmentDetail
                index={index}
                env={env}
                uiToJson={uiToJson}
                key={index}
                attachAws={attachAws}
                tenant={targetData}
                attachedAwsInfo={props.attachedAwsInfo}
                attachAwsCompleted={props.attachAwsCompleted}
                requestGetOperation={props.requestGetOperation}
                requestInvokeOperation={props.requestInvokeOperation}
                getOperationCompleted={props.getOperationCompleted}
                operations={props.operations}
              />
            </TabPanel>
          ))}
        </div>
      </form>
    </React.Fragment>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
