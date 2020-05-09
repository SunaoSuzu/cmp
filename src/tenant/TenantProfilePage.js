import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Divider from "@material-ui/core/Divider";
import AssignmentIcon from '@material-ui/icons/Assignment';
import StorageIcon from '@material-ui/icons/Storage';
import ContractDetails from "./ContractDetails";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Badge from "@material-ui/core/Badge";

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
        height: 800,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    tabPanel: {
        width : "100%",
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    componentPane:{
        width : "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },

}));

export default function TenantProfilePage(props) {
    const classes = useStyles();
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
        props.delFromArray(path , index);
    };
    const addDetail = function addDetail(path,empty){
        props.pushEmpty(path,empty);
    };
    const newEnv = function newEnv(){
        props.requestNewEnv(targetData);
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
                    </div>
                </div>
                <div className={classes.basicInformationPanel}>
                    <TextField name="name" onChange={uiToJson} id="standard-basic" label="テナント名" value={targetData.name} helperText="会社名を入れてください" />
                    <TextField name="alias" onChange={uiToJson} id="standard-basic-alias" label="略称" value={targetData.alias} helperText="略称を入れてください" />
                    <TextField name="statusCaption" onChange={uiToJson} id="standard-basic-status" label="ステータス" value={targetData.statusCaption}
                               InputProps={{
                                   readOnly: true,
                               }}
                               helperText="ステータス" />
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
                            <Tab label={env.name} {...a11yProps((index + 1))}
                                 icon={env.status===1 ?
                                     <Badge badgeContent="draft"
                                            color="primary"
                                            anchorOrigin={{vertical: 'top',horizontal: 'left'}} >
                                         <StorageIcon />
                                     </Badge>
                                     : <StorageIcon />}
                                 className={classes.tabPanel} key={index}/>
                        ))}

                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <ContractDetails targetData={targetData} uiToJson={uiToJson}
                                         addDetail={addDetail} delDetail={delDetail} />
                    </TabPanel>
                    {targetData.environments.map((env , index ) => (
                        <TabPanel value={tabValue} index={index + 1} key={index}>
                            <h4>基礎情報</h4>
                            <TextField name={"environments." + index + ".name"}  onChange={uiToJson}
                                       id="standard-env-name" label="環境名" value={env.name}
                                       helperText="環境名を入れてください" />
                            <TextField name={"environments." + index + ".statusCaption"}  onChange={uiToJson}
                                       id="standard-env-status" label="状態" value={env.statusCaption}
                                       InputProps={{
                                           readOnly: true,
                                       }}
                                       helperText="状態" />
                            <TextField name={"environments." + index + ".vpcTypeCaption"}  onChange={uiToJson}
                                       id="standard-env-vpc-type" label="VPCタイプ" value={env.vpcTypeCaption}
                                       InputProps={{
                                           readOnly: true,
                                       }}
                                       helperText="VPCタイプ" />
                            <TextField name={"environments." + index + ".specLevel"}  onChange={uiToJson}
                                       id="standard-env-spec-level" label="SPECレベル" value={env.specLevel}
                                       InputProps={{
                                           readOnly: true,
                                       }}
                                       helperText="SPECレベル" />
                            <h4>コンポーネント</h4>
                            {env.mainComponents.map((component, index) => (
                                <div className={classes.componentPane} key={index}>
                                    <ExpansionPanel defaultExpanded="true">
                                        <ExpansionPanelSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography className={classes.heading}>{component.name}</Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            {component.params.map((param , i) => (
                                                <TextField name={"environments." + index + ".params." + i}  onChange={uiToJson}
                                                           id={"standard-env-params-" + i} label={param.caption} value={param.now}
                                                           InputProps={{
                                                           }}
                                                           key={i}
                                                           helperText={param.caption} />

                                            ))}
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                </div>
                            ))}
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<StorageIcon />}
                            >
                                作業登録
                            </Button>

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

