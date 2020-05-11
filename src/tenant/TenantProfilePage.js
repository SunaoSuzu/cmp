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
import getConfiguration from "../Configuration";
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

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
    formControl: {
        margin: theme.spacing(1),
        alignItems : "center",
        minWidth: 120,
    },
    basicInformationPanel: {
        margin: theme.spacing(1),
        alignItems : "center",
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
    const conf = getConfiguration();
    const tenantStatusMst = conf.tenantStatusMst;
    const tenantVpcTypeMst = conf.tenantVpcTypeMst;
    const environmentVpcTypeMst = conf.environmentVpcTypeMst;
    const environmentStatusMst = conf.environmentStatusMst;
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
                    <TextField
                        name="name" onChange={uiToJson}
                        id="standard-basic" label="テナント名"
                        value={targetData.name} helperText="会社名を入れてください"
                        margin="dense"
                    />
                    <TextField name="alias" onChange={uiToJson}
                               id="standard-basic-alias" label="略称"
                               value={targetData.alias} helperText="略称を入れてください"
                               margin="dense"
                    />
                    <FormControl className={classes.formControl} >
                        <InputLabel shrink id="standard-basic-status-label" >ステータス</InputLabel>
                        <Select name="status" onChange={uiToJson}
                                id="standard-basic-status"
                                value={targetData.status}
                                inputProps={{
                                    readOnly: true,
                                }}
                                label="ステータス" helperText="ステータス"
                                margin="dense"
                                labelId="standard-basic-status-label"
                        >
                            {tenantStatusMst.map((statusMst) => (
                                <MenuItem value={statusMst.id}
                                          key={statusMst.id}>
                                    {statusMst.caption}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>ステータス</FormHelperText>
                    </FormControl>
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
                        <Tab label="環境方針" {...a11yProps(1)} icon={<AssignmentIcon />} wrapped className={classes.tabPanel} />
                        {targetData.environments.map((env , index ) => (
                            <Tab label={env.name} {...a11yProps((index + 2))}
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
                    <TabPanel value={tabValue} index={1}>
                        <FormControl className={classes.formControl} >
                            <InputLabel shrink id="environment-setting-vpc-label" >VPC方針</InputLabel>
                            <Select name="status" onChange={uiToJson}
                                    id="environment-setting-vpc"
                                    value={targetData.environmentSetting.vpcType}
                                    inputProps={{
                                        readOnly: true,
                                    }}
                                    label="VPC方針" helperText="VPC方針"
                                    margin="dense"
                                    labelId="environment-setting-vpc-label"
                            >
                                {tenantVpcTypeMst.map((vpc) => (
                                    <MenuItem value={vpc.id}
                                              key={vpc.id}>
                                        {vpc.caption}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>VPC作成方針</FormHelperText>
                        </FormControl>
                    </TabPanel>
                    {targetData.environments.map((env , index ) => (
                        <TabPanel value={tabValue} index={index + 2} key={index}>
                            <h4>基礎情報</h4>
                            <TextField name={"environments." + index + ".name"}  onChange={uiToJson}
                                       id="standard-env-name" label="環境名" value={env.name}
                                       margin="dense"
                                       helperText="環境名を入れてください" />
                            <FormControl className={classes.formControl} >
                                <InputLabel shrink id="environment-status-label" >ステータス</InputLabel>
                                <Select name={"environments." + index + ".status"}  onChange={uiToJson}
                                        id="standard-env-status"
                                        value={env.status}
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        label="ステータス" helperText="ステータス"
                                        margin="dense"
                                        labelId="environment-status-label"
                                >
                                    {environmentStatusMst.map((status) => (
                                        <MenuItem value={status.id}
                                                  key={status.id}>
                                            {status.caption}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>ステータス</FormHelperText>
                            </FormControl>
                            <FormControl className={classes.formControl} >
                                <InputLabel shrink id="standard-env-vpc-type-label" >VPC方針</InputLabel>
                                <Select name={"environments." + index + ".vpcType"} onChange={uiToJson}
                                        id="standard-env-vpc-type"
                                        value={env.vpcType}
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        label="VPC方針" helperText="VPC方針"
                                        margin="dense"
                                        labelId="standard-env-vpc-type-label"
                                >
                                    {environmentVpcTypeMst.map((vpc) => (
                                        <MenuItem value={vpc.id}
                                                  key={vpc.id}>
                                            {vpc.caption}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>VPC作成方針</FormHelperText>
                            </FormControl>
                            <TextField name={"environments." + index + ".specLevel"}  onChange={uiToJson}
                                       id="standard-env-spec-level" label="SPECレベル" value={env.specLevel}
                                       inputProps={{
                                           readOnly: true,
                                       }}
                                       margin="dense"
                                       helperText="SPECレベル" />
                            <h4>コンポーネント</h4>
                            {env.mainComponents.map((component,c ) => (
                                <div className={classes.componentPane} key={c}>
                                    <ExpansionPanel defaultExpanded >
                                        <ExpansionPanelSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography className={classes.heading}>{component.name}</Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            {component.params.map((param , i) => (
                                                <TextField name={"environments." + index + ".mainComponents." + c + ".params." + i + ".now"}  onChange={uiToJson}
                                                           id={"standard-env-params-" + i} label={param.caption} value={param.now}
                                                           inputProps={{
                                                           }}
                                                           key={i}
                                                           margin="dense"
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

