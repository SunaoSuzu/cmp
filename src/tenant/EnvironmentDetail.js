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
import {makeStyles} from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from "./TabPanel";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        alignItems : "center",
        minWidth: 120,
    },
    componentPane:{
        width : "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
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

    //for tab
    const [innerTabValue, setInnerTavLavlue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setInnerTavLavlue(newValue);
    };

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
                        <Tab label="AWS(EC2)" {...a11yProps(1)} />
                        <Tab label="パラメータ" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={innerTabValue} index={0} boxShadow={1}>
                    <TextField name={"environments." + index + ".name"}  onChange={uiToJson}
                               id="standard-env-name" label="環境名" value={env.name}
                               margin="dense"
                               helperText="環境名を入れてください" />
                    <TextField name={"environments." + index + ".awsTag"} onChange={uiToJson}
                               id="standard-env-awsTag" label="tag(aws)"
                               helperText="tag(aws)を入れてください"
                               inputProps={{
                                   required: true,
                               }}
                               value={env.awsTag}
                    />
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
                </TabPanel>
                <TabPanel value={innerTabValue} index={1} boxShadow={1}>

                </TabPanel>
                <TabPanel value={innerTabValue} index={2} boxShadow={1}>
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
                </TabPanel>
            </div>


            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<StorageIcon />}
            >
                作業登録
            </Button>

        </React.Fragment>
    );

}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
export default EnvironmentDetail;