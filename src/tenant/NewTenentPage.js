import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from '@material-ui/core/InputLabel';
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import Configuration from "../Configuration";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AssignmentIcon from "@material-ui/icons/Assignment";
import {TabPanel} from "./TenantProfilePage";

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
    tabRoot: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 500,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    button: {
        margin: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function NewTenantPage(props) {
    const classes = useStyles();
    const conf = Configuration();
    const productLicenses = conf.productLicenses;
    console.log(productLicenses);
    const { requestAdd , changePropertyOfNew,newData } = props;
    const send = function send(){
        requestAdd(newData);
    };

    const [tabValue, setValue] = React.useState(0);

    const handleChange = (event, newTabValue) => {
        setValue(newTabValue);
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
                            onClick={send.bind(this)}
                        >
                            Save
                        </Button>
                    </div>
                </div>
                <div className={classes.basicInformationPanel} >
                    <FormControl variant="outlined" className={classes.formControl}>
                        <TextField name="name" onChange={changePropertyOfNew} id="standard-basic"
                                   label="テナント名"  helperText="会社名を入れてください"
                                   margin="normal"
                        />
                    </FormControl>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <TextField name="alias" onChange={changePropertyOfNew}
                                   id="standard-basic-alias" label="略称"
                                   helperText="略称を入れてください" />
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
                        <Tab label="契約内容" {...a11yProps(0)} icon={<AssignmentIcon />} wrapped />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <TextField name="contract.remarks" onChange={changePropertyOfNew} id="standard-basic"
                                   label="契約特記事項"  helperText="契約特記事項" />
                        <TextField name="contract.infraAnnualIncome" onChange={changePropertyOfNew}
                                   id="standard-basic" label="インフラ年間予算"  helperText="インフラ年間予算" />
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel htmlFor="outlined-age-native-simple">製品</InputLabel>
                            <Select
                                native
                                label="製品"
                                inputProps={{
                                    name: 'contract.details.0.productMstId',
                                    id: 'outlined-age-native-simple',
                                }}
                                onChange={changePropertyOfNew}
                            >
                                <option value="1" >CJK</option>
                                <option value="2" >CWS</option>
                                <option value="4" >CSR</option>
                                <option value="3" >CTM</option>
                            </Select>
                        </FormControl>
                        <TextField
                            id="standard-number"
                            name="contract.details.0.amount"
                            label="ライセンス数"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={changePropertyOfNew}
                        />
                    </TabPanel>
                </div>

            </form>
        </React.Fragment>
    )
}
function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}
