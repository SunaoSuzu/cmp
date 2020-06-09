/**
 * Component毎の構成情報（構成情報と、スペックなどの情報は分離）
 * Versionは構成にも響きそうだからここに置いてみたが、、、違う予感
 **/
import React from "react";
import { connect } from "react-redux";
import * as tenantAppModule from "../module/TenantAppModule";
import { makeStyles } from "@material-ui/core/styles";
import Selection from "../../components/Selection";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    divider: {
        margin: theme.spacing(1, 0)
    }
}));

const ComponentPanel = props => {
    const classes = useStyles();
    //    const env=props.env;
    //    const tenant=props.tenant;
    const targetComponent = props.targetComponent;
    const cindex = props.cindex;
    const index = props.index;
    const uiToJson = props.changeProperty;

    const paramPrefix = "environments." + index + ".mainComponents." + cindex;

    //ForDirtyData(今は全部Dirtyなので、いずれ改善)
    if (targetComponent.strategy === undefined) targetComponent.strategy = {};
    if (targetComponent.strategy.version === undefined)
        targetComponent.strategy.version = {};
    if (targetComponent.strategy.ap === undefined)
        targetComponent.strategy.ap = { type: 1 };
    if (targetComponent.strategy.ap.lb === undefined)
        targetComponent.strategy.ap.lb = {};
    if (targetComponent.strategy.db === undefined)
        targetComponent.strategy.db = {};
    if (targetComponent.strategy.batch === undefined)
        targetComponent.strategy.batch = {};
    if (targetComponent.strategy.search === undefined)
        targetComponent.strategy.search = {};

    return (
        <>
            <Typography variant="subtitle1">基本</Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">AP</Typography>
            <TextField
                name={paramPrefix + ".strategy.ap.internalDns"}
                onChange={uiToJson}
                id="strategy-ap-internal-dns"
                label="内部DNS名"
                helperText="内部DNS名（ReadOnlyにしたい）"
                value={targetComponent.strategy.ap.internalDns}
            />
            <Selection
                input={true}
                label="実行方法"
                name={paramPrefix + ".strategy.ap.type"}
                onChange={uiToJson}
                id="component-conf-ap-lb-kind"
                value={targetComponent.strategy.ap.type}
                helperText="EC2/Docker"
                margin="dense"
                options={[
                    { id: 1, caption: "EC2(専用)" },
                    { id: 11, caption: "docker(他APのみ同居)" },
                    { id: 12, caption: "docker(同居)" }
                ]}
            />

            <Divider className={classes.divider} />
            <Typography variant="subtitle2">データベース</Typography>
            <TextField
                name={paramPrefix + ".strategy.db.internalDns"}
                onChange={uiToJson}
                id="strategy-db-internal-dns"
                label="内部DNS名"
                helperText="内部DNS名（ReadOnlyにしたい）"
                value={targetComponent.strategy.db.internalDns}
            />
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">バッチサーバ</Typography>
            <TextField
                name={paramPrefix + ".strategy.batch.internalDns"}
                onChange={uiToJson}
                id="strategy-bs-internal-dns"
                label="内部DNS名"
                helperText="内部DNS名（ReadOnlyにしたい）"
                value={targetComponent.strategy.batch.internalDns}
            />
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">全文検索サーバー</Typography>
            <TextField
                name={paramPrefix + ".strategy.search.internalDns"}
                onChange={uiToJson}
                id="strategy-ss-internal-dns"
                label="内部DNS名"
                helperText="内部DNS名（ReadOnlyにしたい）"
                value={targetComponent.strategy.search.internalDns}
            />
            <Divider className={classes.divider} />
        </>
    );
};
const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        changeProperty: e => dispatch(tenantAppModule.changeProperty(e))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ComponentPanel);
