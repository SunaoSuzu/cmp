import React , { Component  } from 'react';
import {Link, useRouteMatch} from "react-router-dom";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import SuTechGrid from "../asset/SuTechGrid";

//将来的にItemDetaiPageと統合したいけど、難しそう

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 500,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function TenantDetailPage(props) {
    const classes = useStyles();
    console.log(JSON.stringify(props));
    const { updateData , backToList,productGridConf } = props;

    let { path, url } = useRouteMatch();
    const [tabValue, setValue] = React.useState(0);

    const handleChange = (event, newTabValue) => {
        setValue(newTabValue);
    };

    const send = function send(e){
        props.data.name="鈴木商事";
        updateData(props.data);
    }

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
                    {props.data.environments.map((env , index ) => (
                        <Tab label={landScapeCaption(env.landScape)} {...a11yProps((index + 1))} />
                    ))}

                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <form  encType='multipart/form-data' >
                        <TextField id="standard-basic" label="テナント名" defaultValue={props.data.name} helperText="会社名を入れてください" />

                        <div>TenantDetail(dataId = {props.data.id})</div>
                        <div>TenantDetail(dataName = {props.data.name})</div>
                    </form>
                    <button onClick={send.bind(this)}>更新</button>
                </TabPanel>
                {props.data.environments.map((env , index ) => (
                    <TabPanel value={tabValue} index={index + 1}>
                        <TextField id="standard-basic" label="環境名" defaultValue={landScapeCaption(env.landScape)} helperText="環境名を入れてください" />
                        <SuTechGrid title="インストール済みライセンス" gridConf={productGridConf}
                                    datas={env.installedLicences}
                                    goDetailHandler={null}
                                    goAddHandler={null}
                        ></SuTechGrid>

                    </TabPanel>
                ))}
            </div>
            <Link to={backToList} >Back To The List</Link>
        </React.Fragment>
    )
}

function landScapeCaption(i){
    switch (i) {
        case 1:
            return "開発環境";
        case 2:
            return "ステージング環境";
        case 3:
            return "本番環境";
        default :
            return "追加環境";
    }
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
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

