import React, {useEffect} from "react";
import Button from "@material-ui/core/Button";
import StorageIcon from "@material-ui/icons/StorageOutlined";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import VpcLogo from "../../components/VpcLogo";
import ListItemText from "@material-ui/core/ListItemText";
import EC2Logo from "../../components/EC2Logo";
import CodeIcon from "@material-ui/icons/Code";
import * as TenantAppModule from "../TenantAppModule";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import * as tenantAppModule from "../TenantAppModule";
import {getName} from "../../util/AWSUtils";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DownloadLink from "react-download-link";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    formControl: {
        margin: theme.spacing(1),
        // alignItems: "center",
        minWidth: 120
    },
    componentPane: {
        width: "100%"
    },
    tabPanel: {
        width: "100%"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    },
    resources: {
        width: "100%",
        backgroundColor: theme.palette.background.paper
    },
    nested: {
        paddingLeft: theme.spacing(3)
    },
    doubleNested: {
        paddingLeft: theme.spacing(4)
    },
    button: {
        margin: theme.spacing(1)
    }
}));



const AWSPanel = props => {
    const classes = useStyles();
    const [diagOpen, setDiagOpen] = React.useState(false);
    const [mode, setMode] = React.useState("");

    const tenant = props.tenant;
    const env = props.env;
    const index = props.index;

    const getOperationCompleted= props.getOperationCompleted;
    const operations= props.operations;
    const attachedAwsInfo= props.attachedAwsInfo;
    const attachAwsCompleted= props.attachAwsCompleted;

    const getOperation = function getOperation(t, e, i) {
        console.log("getOperation");
        props.requestGetOperation(t, e, i);
    };

    const invokeOperation = function invokeOperation(t, e, i) {
        const key = document.getElementById("apiKey").value;
        const pwd = document.getElementById("apiPwd").value;
        console.log("key=" + key);
        console.log("pwd=" + pwd);
        console.log("t.awsTag=" + t.awsTag);
        console.log("t.awsTag=" + t.awsTag);
        console.log("invokeOperation");
        props.requestInvokeOperation(t, e, i,key,pwd);
        handleClose();
    };

    const resetOperation = function getOperation(t, e, i) {
        console.log("resetOperation");
        props.requestResetOperation(t, e, i);
    };

    if (attachAwsCompleted === TenantAppModule.loadSuccess) {
        console.log("AWSから取り込み成功");
    }

    //DiagOpen
    const handleClickOpenAsAtathchDiag = () => {
        setDiagOpen(true);
        setMode("attach");
    };

    //DiagOpen
    const handleClickOpenAsExecuteDiag = () => {
        setDiagOpen(true);
        setMode("attach");
    };

    //DiagClose
    const handleClose = () => {
        setDiagOpen(false);
        setMode("");
    };

    //DiagClose
    const handleAttachStart = (t, e, i) => {
        const key = document.getElementById("apiKey").value;
        const pwd = document.getElementById("apiPwd").value;
        console.log("key=" + key);
        console.log("pwd=" + pwd);
        console.log("t.awsTag=" + t.awsTag);
        console.log("t.awsTag=" + t.awsTag);
        props.attachAws(t.awsTag, e.awsTag,index,key,pwd);
        setDiagOpen(false);
    };


    return (
        <>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<StorageIcon />}
                onClick={() => getOperation(tenant, env, index)}
            >
                構成決定
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<StorageIcon />}
                onClick={() => handleClickOpenAsAtathchDiag(tenant, env, index)}
            >
                アタッチ
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<StorageIcon />}
                onClick={() => handleClickOpenAsExecuteDiag(tenant, env, index)}
            >
                作業実行
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<StorageIcon />}
                onClick={() => resetOperation(tenant, env, index)}
            >
                破棄
            </Button>
            <DownloadLink
                label="JSON(開発用)"
                filename="env.json"
                exportFile={() => JSON.stringify(env.resources) }
            />

            {env.resources != null ? (
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    className={classes.resources}
                >
                    <ListItem button>
                        <ListItemIcon>
                            <VpcLogo />
                        </ListItemIcon>
                        <ListItemText primary={"hostedZone=" + env.resources.hostedZone} />
                        <ListItemText primary={"vpc=" + env.resources.cidr} />
                    </ListItem>
                    {env.resources.apps.map( (app , aindex) => (
                        <List component="div" disablePadding key={aindex} >
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <EC2Logo />
                                </ListItemIcon>
                                <ListItemText primary={"name=" + app.ap.domain} />
                                <ListItemText primary={"type=" + app.ap.launch.InstanceType} />
                                <ListItemText primary={"ImageId=" + app.ap.launch.ImageId} />
                            </ListItem>
                        </List>
                    ))}
                </List>
            ) : (
                ""
            )}

            {attachAwsCompleted === TenantAppModule.loadSuccess
                ? attachedAwsInfo.vpcs.map( (vpc , vi) => (
                    <React.Fragment key={vi}>
                        <Divider />
                        <div>
                            <VpcLogo />
                            {getName(vpc.Tags)} {vpc.VpcId}
                        </div>
                    </React.Fragment>
                ))
                : ""}
            {attachAwsCompleted === TenantAppModule.loadSuccess
                ? attachedAwsInfo.ec2.map( (ec2,ei ) => (
                    <React.Fragment key={ei}>
                        {ec2.Instances.map(instance => (
                            <>
                                <div>
                                    <EC2Logo />
                                    {getName(instance.Tags)} {instance.InstanceId}{" "}
                                    {instance.InstanceType}
                                </div>
                            </>
                        ))}
                    </React.Fragment>
                ))
                : ""
            }
            <Dialog open={diagOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">アタッチ</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        AWSから情報取得を実行します。API_KEYとパスワードを入力して下さい
                        入力された値の保持は行いません
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="region"
                        label="Region"
                        defaultValue="ap-northeast-1"
                        inputProps={{
                            readOnly: true,
                            required: true,
                        }}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="apiKey"
                        label="API KEY"
                        inputProps={{
                            required: true,
                        }}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="apiPwd"
                        label="API_PASSWORD"
                        type="password"
                        inputProps={{
                            required: true,
                        }}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button id="diagButton" onClick={() => handleAttachStart(tenant, env, index)} color="primary">
                        Attach
                    </Button>
                    <Button id="diagButton" onClick={() => invokeOperation(tenant, env, index)} color="primary">
                        実行
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        getOperationCompleted: state.getOperationCompleted,
        operations: state.operations,
        attachedAwsInfo: state.attachedAwsInfo,
        attachAwsCompleted: state.attachAwsCompleted,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeProperty: (e) => dispatch(tenantAppModule.changeProperty(e)),
        requestGetOperation: (tenant, env, envIndex) =>
            dispatch(tenantAppModule.requestGetOperation(tenant, env, envIndex)),
        requestInvokeOperation: (tenant, env, envIndex , key , pwd) =>
            dispatch(tenantAppModule.requestInvokeOperation(tenant, env, envIndex , key , pwd)),
        requestResetOperation: (tenant, env, envIndex) =>
            dispatch(tenantAppModule.requestResetOperation(tenant, env, envIndex)),
        attachAws: (tenantTag, envTag, envIndex , key , pwd) =>
            dispatch(tenantAppModule.requestAttachAws(tenantTag, envTag, envIndex , key , pwd)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AWSPanel);
