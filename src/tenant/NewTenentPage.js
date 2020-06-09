import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AssignmentIcon from "@material-ui/icons/Assignment";
import TabPanel from "./TabPanel";
import ContractDetails from "./ContractDetails";

const useStyles = makeStyles(theme => ({
  functionPanel: {
    backgroundColor: theme.palette.background.toolbar,
    alignItems: "center"
  },
  functionPanelLeft: {
    flexGrow: 1,
    backgroundColor: "inherit"
  },
  functionPanelRight: {
    textAlign: "right",
    backgroundColor: "inherit"
  },
  basicInformationPanel: {
    margin: theme.spacing(0)
  },
  tabRoot: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 500
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: 128
  },
  sideTab: {
    width: "100%",
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: 128
  },
  tabPanel: {
    padding: theme.spacing(1, 2),
    flexGrow: 1,
    "& .MuiBox-root": {
      boxShadow: "none"
    }
  },
  button: {
    margin: theme.spacing(0.5)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export default function NewTenantPage(props) {
  const classes = useStyles();
  const { requestAdd } = props;

  const handleChange = (event, newTabValue) => {
    setValue(newTabValue);
  };
  const [tabValue, setValue] = React.useState(0);

  const targetData = props.newData;
  const save = function save() {
    requestAdd(targetData);
  };
  const uiToJson = event => {
    props.changePropertyOfNew(event);
  };
  const delDetail = function addDetail(path, index) {
    props.delFromArrayForNew(path, index);
  };
  const addDetail = function addDetail(path, empty) {
    props.pushEmptyForNew(path, empty);
  };

  return (
      <React.Fragment>
        <form encType="multipart/form-data">
          <div className={classes.functionPanel}>
            <div className={classes.functionPanelLeft} />
            <div className={classes.functionPanelRight}>
              <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                  onClick={save.bind(this)}
                  disableElevation
              >
                Save
              </Button>
            </div>
          </div>
          <div className={classes.basicInformationPanel}>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                  name="name"
                  onChange={uiToJson}
                  id="standard-basic"
                  label="テナント名"
                  helperText="会社名を入れてください"
                  required
                  value={targetData.name}
              />
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                  name="alias"
                  onChange={uiToJson}
                  id="standard-basic-alias"
                  label="略称"
                  helperText="略称を入れてください"
                  value={targetData.alias}
              />
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                  name="awsTag"
                  onChange={uiToJson}
                  id="standard-basic-awsTag"
                  label="awsTag"
                  helperText="tag(aws)を入れてください"
                  value={targetData.awsTag}
              />
            </FormControl>
          </div>
          <Divider variant="middle" />
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
            </Tabs>
            <TabPanel className={classes.tabPanel} value={tabValue} index={0}>
              <ContractDetails
                  targetData={targetData}
                  uiToJson={uiToJson}
                  addDetail={addDetail}
                  delDetail={delDetail}
              />
            </TabPanel>
          </div>
        </form>
      </React.Fragment>
  );
}
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}
