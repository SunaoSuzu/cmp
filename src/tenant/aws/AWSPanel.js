import React from "react";
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
    const tenant = props.tenant;
    const env = props.env;
    const index = props.index;

    const getOperationCompleted= props.getOperationCompleted;
    const operations= props.operations;
    const attachedAwsInfo= props.attachedAwsInfo;
    const attachAwsCompleted= props.attachAwsCompleted;

    const attach = function attach(t, e, i) {
        props.attachAws(t.awsTag, e.awsTag);
    };

    const getOperation = function getOperation(t, e, i) {
        console.log("getOperation");
        props.requestGetOperation(t, e, i);
    };

    const invokeOperation = function getOperation(t, e, i) {
        console.log("invokeOperation");
        props.requestInvokeOperation(t, e, i);
    };

    const resetOperation = function getOperation(t, e, i) {
        console.log("resetOperation");
        props.requestResetOperation(t, e, i);
    };

    if (attachAwsCompleted === TenantAppModule.loadSuccess) {
        console.log("AWSから取り込み成功");
    }

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
                onClick={() => attach(tenant, env, index)}
            >
                アタッチ
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<StorageIcon />}
                onClick={() => invokeOperation(tenant, env, index)}
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
                        <ListItemText primary={"vpc=" + env.resources.vpcName} />
                        <ListItemText primary={"add=" + env.resources.add} />
                        <ListItemText primary={"attached=" + env.resources.attached} />
                        {env.resources.tags.map((tag,ti) => (
                            <ListItemText primary={"t:" + tag.name + "=" + tag.value} key={ti}/>
                        ))}
                    </ListItem>
                    {env.resources.ec2.map( (instance,ei)  => (
                        <List component="div" disablePadding key={ei}>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <EC2Logo />
                                </ListItemIcon>
                                <ListItemText primary={"type=" + instance.instanceType} />
                                <ListItemText primary={"add=" + instance.add} />
                                <ListItemText primary={"attached=" + instance.attached} />
                                {instance.tags.map( (tag,ti) => (
                                    <ListItemText
                                        key={ti}
                                        primary={"t:" + tag.name + "=" + tag.value}
                                    />
                                ))}
                            </ListItem>
                            {instance.components.map( (component , ci) => (
                                <List component="div" disablePadding key={ci}>
                                    <ListItem button className={classes.doubleNested}>
                                        <ListItemIcon>
                                            <CodeIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={"name=" + component.name} />
                                    </ListItem>
                                </List>
                            ))}
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
                : ""}
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
        requestInvokeOperation: (tenant, env, envIndex) =>
            dispatch(tenantAppModule.requestInvokeOperation(tenant, env, envIndex)),
        requestResetOperation: (tenant, env, envIndex) =>
            dispatch(tenantAppModule.requestResetOperation(tenant, env, envIndex)),
        attachAws: (tenantTag, envTag, envIndex) =>
            dispatch(tenantAppModule.requestAttachAws(tenantTag, envTag, envIndex)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AWSPanel);
