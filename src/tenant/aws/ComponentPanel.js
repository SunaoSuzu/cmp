/**
 * Component毎の構成情報（構成情報と、スペックなどの情報は分離）
 * Versionは構成にも響きそうだからここに置いてみたが、、、違う予感
 **/
import React from "react";
import {connect} from "react-redux";
import * as tenantAppModule from "../TenantAppModule";
import { productMeta } from "../../conf/ProductPattern";
import {makeStyles} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import Selection from "../../components/Selection";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
    panel: {
    },
}));


const ComponentPanel = props => {
    const classes = useStyles();
    const targetComponent=props.targetComponent;
    const cindex=props.cindex;
    const index=props.index;
    const env=props.env;
    const tenant=props.tenant;
    const uiToJson = props.changeProperty;

    const paramPrefix = "environments." + index + ".mainComponents." + cindex;

    //ForDirtyData(今は全部Dirtyなので、いずれ改善)
    if(targetComponent.strategy===undefined)targetComponent.strategy={};
    if(targetComponent.strategy.version===undefined)targetComponent.strategy.version={};
    if(targetComponent.strategy.ap===undefined)targetComponent.strategy.ap={};
    if(targetComponent.strategy.ap.lb===undefined)targetComponent.strategy.ap.lb={};
    if(targetComponent.strategy.db===undefined)targetComponent.strategy.db={};
    if(targetComponent.strategy.batch===undefined)targetComponent.strategy.batch={};
    if(targetComponent.strategy.search===undefined)targetComponent.strategy.search={};

    return (
        <>
            基本
            <Selection input={true}
                       label="Version"
                       name={paramPrefix + ".strategy.version.no"}
                       onChange={uiToJson}
                       id="component-conf-ap-lb-kind"
                       value={targetComponent.strategy.version.no}
                       helperText="Version"
                       margin="dense"
                       options={[{id:100, caption: "1.00"},{id:111, caption: "1.1.1"},{id:200 , caption : "2.00" ,}]}
            />
            <Divider/>
            AP
            <TextField
                name={paramPrefix + ".strategy.ap.internalDns"}
                onChange={uiToJson}
                id="standard-strategy-bastion-access-froms"
                label="内部DNS名"
                helperText="内部DNS名（ReadOnlyにしたい）"
                value={targetComponent.strategy.ap.internalDns}
            />
            <Selection input={true}
                       label="LB種別"
                       name={paramPrefix + ".strategy.ap.lb.kind"}
                       onChange={uiToJson}
                       id="component-conf-ap-lb-kind"
                       value={targetComponent.strategy.ap.lb.kind}
                       helperText="LB種別"
                       margin="dense"
                       options={[{id:1, caption: "ALB"},{id:2 , caption : "ELB" ,}]}
            />
            <Selection input={true}
                       label="実行方法"
                       name={paramPrefix + ".strategy.ap.type"}
                       onChange={uiToJson}
                       id="component-conf-ap-lb-kind"
                       value={targetComponent.strategy.ap.type}
                       helperText="EC2/Docker"
                       margin="dense"
                       options={[{id:1, caption: "EC2(専用)"},{id:11 , caption : "docker(他APのみ同居)"},{id:12 , caption : "docker(同居)"}]}
            />

            <Divider/>
            データベース
            <TextField
                name={paramPrefix + ".strategy.db.internalDns"}
                onChange={uiToJson}
                id="standard-strategy-bastion-access-froms"
                label="内部DNS名"
                helperText="内部DNS名（ReadOnlyにしたい）"
                value={targetComponent.strategy.db.internalDns}
            />
            <Divider/>
            バッチサーバ
            <TextField
                name={paramPrefix + ".strategy.batch.internalDns"}
                onChange={uiToJson}
                id="standard-strategy-bastion-access-froms"
                label="内部DNS名"
                helperText="内部DNS名（ReadOnlyにしたい）"
                value={targetComponent.strategy.batch.internalDns}
            />
            <Divider/>
            全文検索サーバー
            <TextField
                name={paramPrefix + ".strategy.search.internalDns"}
                onChange={uiToJson}
                id="standard-strategy-bastion-access-froms"
                label="内部DNS名"
                helperText="内部DNS名（ReadOnlyにしたい）"
                value={targetComponent.strategy.search.internalDns}
            />
            <Divider/>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeProperty: (e) => dispatch(tenantAppModule.changeProperty(e)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ComponentPanel);
