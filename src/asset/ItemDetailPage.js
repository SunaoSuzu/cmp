import React, { Component } from "react";
import logo from "./Logo_H_x2.png";
import { Link, useRouteMatch } from "react-router-dom";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 800,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function ItemDetailPage(props) {
  const classes = useStyles();
  console.log(JSON.stringify(props));
  const { updateData, backToList } = props;

  let { path, url } = useRouteMatch();
  const [tabValue, setValue] = React.useState(0);

  const handleChange = (event, newTabValue) => {
    setValue(newTabValue);
  };

  const send = function send(e) {
    props.data.name = "鈴木商事";
    updateData(props.data);
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabValue}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="基本情報" {...a11yProps(0)} />
          <Tab label="本番環境" {...a11yProps(1)} />
          <Tab label="試験環境" {...a11yProps(2)} />
          <Tab label="開発環境" {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <form encType="multipart/form-data">
            <TextField
              id="standard-basic"
              label="テナント名"
              defaultValue={props.data.name}
              helperText="会社名を入れてください"
            />

            <div>TenantDetail(dataId = {props.data.id})</div>
            <div>TenantDetail(dataName = {props.data.name})</div>
            <div>TenantDetail(dataLicences = {props.data.licences})</div>
            <div>TenantDetail(dataVersion = {props.data.version})</div>
          </form>
          <button onClick={send.bind(this)}>更新</button>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          Item Four
        </TabPanel>
      </div>

      <Link to={backToList}>Back To The List</Link>
    </React.Fragment>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
