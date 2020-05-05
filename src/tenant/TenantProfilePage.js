import React from "react";
import {Link} from "react-router-dom";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import SuTechGrid from "../asset/SuTechGrid";
import getConfiguration from "../Configuration";


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

export default function TenantProfilePage(props) {
    const conf = getConfiguration();
    const productGridConf = conf.productGridConf;
    const classes = useStyles();
    console.log(JSON.stringify(props));
    const { updateData , backToList,changeProperty,updateComplete } = props;

//    let { path, url } = useRouteMatch();
    const [tabValue, setValue] = React.useState(0);

    const handleChange = (event, newTabValue) => {
        setValue(newTabValue);
    };


    const send = function send(e){
        console.log(e);
        updateData(props.data);
    };

    const changePropertyOfInput = (event) => {
        changeProperty(event);
    };

    const data = props.data;

    return (

        <React.Fragment>
            <button onClick={send.bind(this)}>更新</button><div> updateComplete={updateComplete}</div>
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
                    {data.environments.map((env , index ) => (
                        <Tab label={env.name} {...a11yProps((index + 1))} />
                    ))}

                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <form  encType='multipart/form-data' >
                        <TextField name="name" onChange={changePropertyOfInput} id="standard-basic" label="テナント名" defaultValue={data.name} helperText="会社名を入れてください" />
                        <TextField name="contract.remarks" onChange={changePropertyOfInput} id="standard-basic" label="契約特記事項" defaultValue={data.contract.remarks} helperText="契約特記事項" />
                        <TextField name="contract.infraAnnualIncome" onChange={changePropertyOfInput} id="standard-basic" label="インフラ年間予算" defaultValue={data.infraAnnualIncome} helperText="インフラ年間予算" />

                        <div>TenantDetail(dataId = {data.id})</div>
                        <div>TenantDetail(dataName = {data.name})</div>
                    </form>
                </TabPanel>
                {data.environments.map((env , index ) => (
                    <TabPanel value={tabValue} index={index + 1}>
                        <TextField name={"environments." + index + ".name"}  onChange={changePropertyOfInput} id="standard-basic" label="環境名" defaultValue={env.name} helperText="環境名を入れてください" />
                        <SuTechGrid title="インストール済みライセンス" gridConf={productGridConf}
                                    datas={env.installedLicences}
                                    goDetailHandler={null}
                                    goAddHandler={null}
                        />

                    </TabPanel>
                ))}
            </div>
            <Link to={backToList} >Back To The List</Link>
        </React.Fragment>
    )
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

