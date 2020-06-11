/**
 * 環境の基礎情報のパネルの中身
 * */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Selection from "../../components/Selection";
import getConfiguration from "../../Configuration";
import Divider from "@material-ui/core/Divider";
import DomainSetting from "../../conf/Domain";
import * as CommonCost from "../../common/CommonConst"

const BasicInfoPanel = props => {
    const conf = getConfiguration();
    const environmentVpcTypeMst = conf.environmentVpcTypeMst;
    const environmentStatusMst = conf.environmentStatusMst;

    const index = props.index;
    const env = props.env;
    const uiToJson = props.uiToJson;

    //ForDirtyData(今は全部Dirtyなので、いずれ改善)
    if(env.strategy===undefined)env.strategy={};
    if(env.strategy.network===undefined)env.strategy.network={};
    if(env.strategy.bastion===undefined)env.strategy.bastion={};

    const paramPrefix = ""; //消してOKのはず
    const domain = DomainSetting.default;

    const impossible = false;  //常に入力不可能な項目
    const immutable  = env.status === CommonCost.STATUS_DRAFT ? true : false;  //一度決まったら変えれない
    const changeable = env.status === CommonCost.STATUS_DRAFT||env.status === CommonCost.STATUS_OK ? true : false;  //構築が終わったら変えれる（あとで機能追加）
    const noImpact   = true;  //いつでもいじれる（環境に反映されない）

    return (
        <>
            <TextField
                name={"name"}
                onChange={uiToJson}
                id="standard-env-name"
                label="環境名"
                value={env.name}
                inputProps={{
                    readOnly: !noImpact
                }}
                margin="dense"
                helperText="環境名を入れてください"
            />
            <TextField
                name={"subDomain"}
                onChange={uiToJson}
                id="standard-sub-domain"
                label="サブドメイン"
                value={env.subDomain}
                margin="dense"
                helperText={"https://" + env.subDomain + "." + domain.url}
                inputProps={{
                    readOnly: !immutable
                }}
            />
            <TextField
                name={"awsTag"}
                onChange={uiToJson}
                id="standard-env-awsTag"
                label="tag(aws)"
                helperText="tag(aws)を入れてください"
                inputProps={{
                    required: true,
                    readOnly: !changeable
                }}
                value={env.awsTag}
            />
            <Selection input={true}
                       label="環境状態"
                       name={"status"}
                       onChange={uiToJson}
                       id="standard-basic-status"
                       value={env.status}
                       readOnly={!impossible}
                       helperText="環境状態"
                       margin="dense"
                       options={environmentStatusMst}
            />
            <TextField
                name={"specLevel"}
                onChange={uiToJson}
                id="standard-env-spec-level"
                label="SPECレベル"
                value={env.specLevel}
                inputProps={{
                    readOnly: !changeable
                }}
                margin="dense"
                helperText="SPECレベル"
            />
            <Divider/>
            <Selection input={true}
                       label="VPC方針"
                       name={"vpcType"}
                       onChange={uiToJson}
                       id="standard-basic-vpc-type"
                       value={env.vpcType}
                       readOnly={!immutable}
                       helperText="VPC方針"
                       margin="dense"
                       options={environmentVpcTypeMst}
            />
            <Selection input={true}
                       label="AZ数"
                       name={"strategy.network.az"}
                       onChange={uiToJson}
                       id="standard-strategy-web-minimum-az"
                       readOnly={!changeable}
                       value={env.strategy.network.az}
                       helperText="AZ数"
                       margin="dense"
                       options={[{id:2 , caption : "2" ,},{id:3, caption : "3"}]}
            />
            <Selection input={true}
                       label="NatGateWay"
                       name={"strategy.network.nat"}
                       onChange={uiToJson}
                       id="standard-strategy-web-publishing"
                       value={env.strategy.network.nat}
                       helperText="外部への通信用"
                       margin="dense"
                       options={[{id:false , caption: "不要"},{id:true , caption : "必要（EIP）" }]}
                       readOnly={!changeable}
            />
            <Divider/>
            <Selection input={true}
                       label="SSH Bastion"
                       name={"strategy.bastion.create"}
                       onChange={uiToJson}
                       id="standard-strategy-bastion-create"
                       value={env.strategy.bastion.create}
                       helperText="SSH Bastion"
                       margin="dense"
                       options={[{id:0, caption: "作らない"},{id:1 , caption : "作る" ,}]}
                       readOnly={!changeable}
            />
            <TextField
                name={"strategy.bastion.accessFroms"}
                onChange={uiToJson}
                id="standard-strategy-bastion-access-froms"
                label="許可するIP"
                helperText="カンマ区切りで複数指定可能"
                value={env.strategy.bastion.accessFroms}
                inputProps={{
                    readOnly: !changeable
                }}
            />
        </>
    );
}
export default BasicInfoPanel;