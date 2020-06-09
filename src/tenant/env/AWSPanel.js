import React from "react";
import Button from "@material-ui/core/Button";
import StorageIcon from "@material-ui/icons/StorageOutlined";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import VpcLogo from "../../components/aws/VpcLogo";
import ListItemText from "@material-ui/core/ListItemText";
import EC2Logo from "../../components/aws/EC2Logo";
import * as TenantAppModule from "../module/TenantAppModule";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {getName} from "../../util/AWSUtils";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DownloadLink from "react-download-link";
import * as CommonCost from "../../common/CommonConst"
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import converter from "../../convert/ToCloudFormation";
import {requestGetOperation,requestInvokeOperation,requestResetOperation} from "../module/EnvironmentModule";


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

    const tenant = props.tenant;
    const env = props.env;
    const index = props.index;

    const getOperationCompleted= props.getOperationCompleted;
    const attachedAwsInfo= props.attachedAwsInfo;
    const attachAwsCompleted= props.attachAwsCompleted;

    const getOperation = function getOperation(t, e, i) {
        props.requestGetOperation(t, e, i);
    };

    const invokeOperation = function invokeOperation(t, e, i) {
        const key = document.getElementById("apiKey").value;
        const pwd = document.getElementById("apiPwd").value;
        props.requestInvokeOperation(t, e, i,key,pwd);
        handleClose();
    };

    const resetOperation = function getOperation(t, e, i) {
        props.requestResetOperation(t, e, i);
    };

    if (attachAwsCompleted === TenantAppModule.loadSuccess) {
        console.log("AWSから取り込み成功");
    }

    //DiagOpen
    const handleClickOpenAsAtathchDiag = () => {
        setDiagOpen(true);
    };

    //DiagOpen
    const handleClickOpenAsExecuteDiag = () => {
        setDiagOpen(true);
    };

    //DiagClose
    const handleClose = () => {
        setDiagOpen(false);
    };

    //DiagClose
    const handleAttachStart = (t, e, i) => {
        const key = document.getElementById("apiKey").value;
        const pwd = document.getElementById("apiPwd").value;
        props.attachAws(t.awsTag, e.awsTag,index,key,pwd);
        setDiagOpen(false);
    };

    const disableOperationBtn = env.status === CommonCost.STATUS_DRAFT ? false : true;
    const disableAttachBtn = true;
    const disableInvokeBtn = env.status === CommonCost.STATUS_PLANED ? false : true;
    const disableResetBtn = false;


    return (
        <>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<StorageIcon />}
                disabled={disableOperationBtn}
                onClick={() => getOperation(tenant, env, index)}
            >
                構成決定
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<CloudUploadIcon />}
                disabled={disableInvokeBtn}
                onClick={() => handleClickOpenAsExecuteDiag(tenant, env, index)}
            >
                作業実行
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<DeleteIcon />}
                disabled={disableResetBtn}
                onClick={() => resetOperation(tenant, env, index)}
            >
                破棄
            </Button>
            <DownloadLink
                label="JSON(開発用)"
                filename="env.json"
                exportFile={() => JSON.stringify(env) }
            />
            <DownloadLink
                label="Template"
                filename="template.json"
                exportFile={() => JSON.stringify(converter.convert(env.resources)) }
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
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
        getOperationCompleted: state.env.getOperationCompleted,
        attachedAwsInfo: state.tenant.attachedAwsInfo,
        attachAwsCompleted: state.tenant.attachAwsCompleted,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestGetOperation: (tenant, env, envIndex) =>
            dispatch(requestGetOperation(tenant, env, envIndex)),
        requestInvokeOperation: (tenant, env, envIndex , key , pwd) =>
            dispatch(requestInvokeOperation(tenant, env, envIndex , key , pwd)),
        requestResetOperation: (tenant, env, envIndex) =>
            dispatch(requestResetOperation(tenant, env, envIndex)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AWSPanel);
