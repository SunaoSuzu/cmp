import React from "react";
import Button from "@material-ui/core/Button";
import StorageIcon from "@material-ui/icons/StorageOutlined";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import VpcLogo from "../../components/aws/VpcLogo";
import ListItemText from "@material-ui/core/ListItemText";
import EC2Logo from "../../components/aws/EC2Logo";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
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

    const getOperation = function getOperation(t, e, i) {
        props.requestGetOperation(t, e, i);
    };

    const invokeOperation = function invokeOperation(t, e, i) {
        props.requestInvokeOperation(t, e, i);
        handleClose();
    };

    const resetOperation = function getOperation(t, e, i) {
        props.requestResetOperation(t, e, i);
    };

    //DiagOpen
    const handleClickOpenAsExecuteDiag = () => {
        setDiagOpen(true);
    };

    //DiagClose
    const handleClose = () => {
        setDiagOpen(false);
    };

    const disableOperationBtn = env.status === CommonCost.STATUS_DRAFT ? false : true;
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

            <Dialog open={diagOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">CloudFormationの実行</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                         AWSで処理を実施します
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        requestGetOperation: (tenant, env, envIndex) =>
            dispatch(requestGetOperation(tenant, env, envIndex)),
        requestInvokeOperation: (tenant, env, envIndex ) =>
            dispatch(requestInvokeOperation(tenant, env, envIndex )),
        requestResetOperation: (tenant, env, envIndex) =>
            dispatch(requestResetOperation(tenant, env, envIndex)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AWSPanel);
