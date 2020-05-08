import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import SuTechGrid from "../asset/SuTechGrid";
import getConfiguration from "../Configuration";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Divider from "@material-ui/core/Divider";
import AssignmentIcon from '@material-ui/icons/Assignment';
import StorageIcon from '@material-ui/icons/Storage';
import ContractDetails from "./ContractDetails";

//将来的にItemDetaiPageと統合したいけど、難しそう
const useStyles = makeStyles((theme) => ({
    functionPanel: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.grey["200"],
        width : "100%",
        alignItems : "center",
    },
    functionPanelLeft :{
        flexGrow: 1,
    },
    functionPanelRight :{
        textAlign: "right",
    },
    basicInformationPanel: {
        margin: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
    tabRoot: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 500,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    tabPanel: {
        width : "100%",
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function TenantProfilePage(props) {
    const conf = getConfiguration();
    const productGridConf = conf.productGridConf;
    const classes = useStyles();
    console.log(JSON.stringify(props));
    const { requestUpdate , changeProperty } = props;

//    let { path, url } = useRouteMatch();
    const [tabValue, setValue] = React.useState(0);

    const handleChange = (event, newTabValue) => {
        setValue(newTabValue);
    };



    //ここで新規登録画面との変数名の違いを吸収
    const targetData = props.data;
    const save = function save(){
        requestUpdate(props.data);
    };
    const uiToJson = (event) => {
        changeProperty(event);
    };
    const delDetail = function addDetail(path , index){
        props.delFromArrayForNew(path , index);
    };
    const addDetail = function addDetail(path,empty){
        props.pushEmptyForNew(path,empty);
    };



    return (

        <React.Fragment>
            <form  encType='multipart/form-data' >
                <div className={classes.functionPanel}>
                    <div className={classes.functionPanelLeft}>
                    </div>
                    <div className={classes.functionPanelRight} >
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
                    </div>
                </div>
                <div className={classes.basicInformationPanel}>
                    <TextField name="name" onChange={uiToJson} id="standard-basic" label="テナント名" defaultValue={targetData.name} helperText="会社名を入れてください" />
                    <TextField name="alias" onChange={uiToJson} id="standard-basic-alias" label="略称" defaultValue={targetData.alias} helperText="略称を入れてください" />
                </div>
                <Divider/>
                <div className={classes.tabRoot}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={tabValue}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        className={classes.tabs}
                    >
                        <Tab label="契約内容" {...a11yProps(0)} icon={<AssignmentIcon />} wrapped className={classes.tabPanel} />
                        {targetData.environments.map((env , index ) => (
                            <Tab label={env.name} {...a11yProps((index + 1))} icon={<StorageIcon />} className={classes.tabPanel} />
                        ))}

                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <ContractDetails targetData={targetData} uiToJson={uiToJson}
                                         addDetail={addDetail} delDetail={delDetail} />
                    </TabPanel>
                    {targetData.environments.map((env , index ) => (
                        <TabPanel value={tabValue} index={index + 1}>
                            <TextField name={"environments." + index + ".name"}  onChange={uiToJson}
                                       id="standard-basic" label="環境名" defaultValue={env.name}
                                       helperText="環境名を入れてください" />
                            <SuTechGrid title="インストール済みライセンス" gridConf={productGridConf}
                                        datas={env.installedLicences}
                                        goDetailHandler={null}
                                        goAddHandler={null}
                            />

                        </TabPanel>
                    ))}
                </div>
            </form>
        </React.Fragment>
    )
}

export function TabPanel(props) {
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
                    <Typography component={'span'} variant={'body2'}>{children}</Typography>
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

