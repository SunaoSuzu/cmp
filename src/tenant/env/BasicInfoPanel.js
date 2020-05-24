/**
 * 環境の基礎情報のパネルの中身
 * */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Selection from "../../components/Selection";
import getConfiguration from "../../Configuration";
import Divider from "@material-ui/core/Divider";

const BasicInfoPanel = props => {
    const conf = getConfiguration();
    const environmentVpcTypeMst = conf.environmentVpcTypeMst;
    const environmentStatusMst = conf.environmentStatusMst;

    const index = props.index;
    const env = props.env;
    const uiToJson = props.uiToJson;

    //ForDirtyData(今は全部Dirtyなので、いずれ改善)
    if(env.strategy==undefined)env.strategy={};
    if(env.strategy.network==undefined)env.strategy.network={};
    if(env.strategy.bastion==undefined)env.strategy.bastion={};

    const paramPrefix = "environments." + index;

    return (
        <>
            <TextField
                name={paramPrefix + ".name"}
                onChange={uiToJson}
                id="standard-env-name"
                label="環境名"
                value={env.name}
                margin="dense"
                helperText="環境名を入れてください"
            />
            <TextField
                name={paramPrefix + ".domain"}
                onChange={uiToJson}
                id="standard-env-name"
                label="ドメイン"
                value={env.domain}
                margin="dense"
                helperText="ドメイン名を入れてください"
            />
            <TextField
                name={paramPrefix + ".awsTag"}
                onChange={uiToJson}
                id="standard-env-awsTag"
                label="tag(aws)"
                helperText="tag(aws)を入れてください"
                inputProps={{
                    required: true
                }}
                value={env.awsTag}
            />
            <Selection input={true}
                       label="環境状態"
                       name={paramPrefix + ".status"}
                       onChange={uiToJson}
                       id="standard-basic-status"
                       value={env.status}
                       readOnly={true}
                       helperText="環境状態"
                       margin="dense"
                       options={environmentStatusMst}
            />
            <TextField
                name={paramPrefix + ".specLevel"}
                onChange={uiToJson}
                id="standard-env-spec-level"
                label="SPECレベル"
                value={env.specLevel}
                inputProps={{
                    readOnly: true
                }}
                margin="dense"
                helperText="SPECレベル"
            />
            <Divider/>
            <Selection input={true}
                       label="VPC方針"
                       name={paramPrefix + ".vpcType"}
                       onChange={uiToJson}
                       id="standard-basic-vpc-type"
                       value={env.vpcType}
                       readOnly={true}
                       helperText="VPC方針"
                       margin="dense"
                       options={environmentVpcTypeMst}
            />
            <Selection input={true}
                       label="AZ数"
                       name={paramPrefix + ".strategy.network.az"}
                       onChange={uiToJson}
                       id="standard-strategy-web-minimum-az"
                       value={env.strategy.network.az}
                       helperText="AZ数"
                       margin="dense"
                       options={[{id:2 , caption : "2" ,},{id:3, caption : "3"}]}
            />
            <Selection input={true}
                       label="NatGateWay"
                       name={paramPrefix + ".strategy.network.natgateway"}
                       onChange={uiToJson}
                       id="standard-strategy-web-publishing"
                       value={env.strategy.network.natgateway}
                       helperText="外部への通信用"
                       margin="dense"
                       options={[{id:false , caption: "不要"},{id:true , caption : "必要（EIP）" ,}]}
            />
            <Divider/>
            <Selection input={true}
                       label="SSH Bastion"
                       name={paramPrefix + ".strategy.bastion.create"}
                       onChange={uiToJson}
                       id="standard-strategy-bastion-create"
                       value={env.strategy.bastion.create}
                       helperText="SSH Bastion"
                       margin="dense"
                       options={[{id:0, caption: "作らない"},{id:1 , caption : "作る" ,}]}
            />
            <TextField
                name={paramPrefix + ".strategy.bastion.accessFroms"}
                onChange={uiToJson}
                id="standard-strategy-bastion-access-froms"
                label="許可するIP"
                helperText="カンマ区切りで複数指定可能"
                value={env.strategy.bastion.accessFroms}
            />
        </>
    );
}
export default BasicInfoPanel;