import React from "react";
import Button from "@material-ui/core/Button";
import StorageIcon from "@material-ui/icons/StorageOutlined";
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
import {
    getOperation,
    getUpdOperation,
    invokeOperation,
    resetOperation,
    getChangeSet,
    executeChangeSet,
    resetUpdOperation
} from "../module/EnvironmentModule";
import CloudFormationTable from "./CloudFormationTable";
import ChangeSetTable from "./ChangeSetTable";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";


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
    container: {
        maxHeight: 440,
    },
    button: {
        margin: theme.spacing(0.5)
    }
}));



const AWSPanel = props => {
    const classes = useStyles();
    const [diagOpen, setDiagOpen] = React.useState(false);
    const [updDiagOpen, setUpdDiagOpen] = React.useState(false);

    const tenant = props.tenant;
    const env = props.env;
    const index = props.index;

    const getOperation = function getOperation(t, e, i) {
        props.getOperation(t, e, i);
    };

    const invokeOperation = function invokeOperation(t, e, i) {
        props.invokeOperation(t, e, i);
        handleClose();
    };

    const getChangeSet = function getChangeSet(t, e, i) {
        props.getChangeSet(t, e, i);
        handleUpdClose();
    };

    const resetOperation = function getOperation(t, e, i) {
        props.resetOperation(t, e, i);
    };

    //DiagOpen
    const handleClickOpenAsExecuteDiag = () => {
        setDiagOpen(true);
    };

    //DiagClose
    const handleClose = () => {
        setDiagOpen(false);
    };

    const handleClickOpenUpdDiag = () => {
        setUpdDiagOpen(true);
    };
    const handleUpdClose = () => {
        setUpdDiagOpen(false);
    };


    const disableOperationBtn = env.status === CommonCost.STATUS_DRAFT ? false : true;
    const disableInvokeBtn = env.status === CommonCost.STATUS_PLANED ? false : true;
    const disableResetBtn = env.status === CommonCost.STATUS_DRAFT||env.status === CommonCost.STATUS_PLANED ? false : true;
    const disableUpdOperationBtn = env.status === CommonCost.STATUS_OK ? false : true;
    const disableChangeSetBtn = env.status === CommonCost.STATUS_MOD_PLANED ? false : true;
    const disableUpdResetBtn = env.status === CommonCost.STATUS_MOD_PLANED||env.status === CommonCost.STATUS_CHANGE_SET ? false : true;
    const disableUpdInvokeBtn = env.status === CommonCost.STATUS_CHANGE_SET ? false : true;


    const BUTTONS_CREATE = (<>
        <Button
            variant="contained"
            className={classes.button}
            startIcon={<StorageIcon />}
            disabled={disableOperationBtn}
            onClick={() => getOperation(tenant, env, index)}
            disableElevation
        >
            構成決定
        </Button>
        <Button
            variant="contained"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
            disabled={disableInvokeBtn}
            onClick={() => handleClickOpenAsExecuteDiag(tenant, env, index)}
            disableElevation
        >
            作業実行
        </Button>
        <Button
            variant="contained"
            className={classes.button}
            startIcon={<DeleteIcon />}
            disabled={disableResetBtn}
            onClick={() => resetOperation(tenant, env, index)}
            disableElevation
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

    </>);

    const BUTTONS_UPD = (<>
        <Button
            variant="contained"
            className={classes.button}
            startIcon={<StorageIcon />}
            disabled={disableUpdOperationBtn}
            onClick={() => props.getUpdOperation(tenant, env, index)}
            disableElevation
        >
            構成決定
        </Button>
        <Button
            variant="contained"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
            disabled={disableChangeSetBtn}
            onClick={() => handleClickOpenUpdDiag(tenant, env, index)}
            disableElevation
        >
            ChangeSet
        </Button>
        <Button
            variant="contained"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
            disabled={disableUpdInvokeBtn}
            onClick={() => props.executeChangeSet(tenant, env, index)}
            disableElevation
        >
            環境更新
        </Button>
        <Button
            variant="contained"
            className={classes.button}
            startIcon={<DeleteIcon />}
            disabled={disableUpdResetBtn}
            onClick={() => props.resetUpdOperation(tenant, env, index)}
            disableElevation
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

    </>);

    const BUTTONS = env.status < CommonCost.STATUS_OK ? BUTTONS_CREATE : BUTTONS_UPD;

    const showChangeSet = (env.status === CommonCost.STATUS_CHANGE_SET||env.status === CommonCost.STATUS_MOD_ING);
//    const showTemplate = (!showChangeSet&&env.stack !== null&&env.stack !== undefined&&env.stack.template !== null&&env.stack.template !== undefined);
    const showTemplate = (!showChangeSet&&(env.status === CommonCost.STATUS_PLANED||env.status === CommonCost.STATUS_MOD_PLANED));

    return (
        <>
            {BUTTONS}
            {showChangeSet ? (
                <>
                </>
            ) : ""}
            {showTemplate ? (
                <>
                    <Typography variant="subtitle1">StackName : {env.stack.name} status : {env.stack.status}</Typography>
                    <Divider className={classes.divider} />
                    <CloudFormationTable resources={env.stack.template.Resources}/>
                </>
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

            <Dialog open={updDiagOpen} onClose={handleUpdClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">CloudFormationの更新</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        AWSでCloudFormationのChangeSetを実施します
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
                    <Button onClick={handleUpdClose} color="primary">
                        Cancel
                    </Button>
                    <Button id="diagButton" onClick={() => getChangeSet(tenant, env, index)} color="primary">
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
        getOperation: (tenant, env, envIndex) =>
            dispatch(getOperation(tenant, env, envIndex)),
        getUpdOperation: (tenant, env, envIndex) =>
            dispatch(getUpdOperation(tenant, env, envIndex)),
        invokeOperation: (tenant, env, envIndex ) =>
            dispatch(invokeOperation(tenant, env, envIndex )),
        resetOperation: (tenant, env, envIndex) =>
            dispatch(resetOperation(tenant, env, envIndex)),
        resetUpdOperation: (tenant, env, envIndex) =>
            dispatch(resetUpdOperation(tenant, env, envIndex)),
        getChangeSet: (tenant, env, envIndex) =>
            dispatch(getChangeSet(tenant, env, envIndex)),
        executeChangeSet: (tenant, env, envIndex) =>
            dispatch(executeChangeSet(tenant, env, envIndex)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AWSPanel);
