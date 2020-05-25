/**
 * 大まかな処理の流れ
 * ネットワーク系の構築（ALBまで）
 * Bastionの構築（もしくはPeering）
 * アプリ毎に、バックエンド系を構築（主にはEC2を立てるだけ）
 * アプリ毎に、フロントを立ててLBとくっつける
 * PublicDNSにルーティング
 **/

const AWS = require('aws-sdk');
const ec2 = require('./ec2/EC2Command');
const vpc = require('./network/VpcCommand');
const autoScale = require("./ec2/AutoScalingCommand");
const alb = require("./lb/AlbCommand");
const linkAlb = require("./lb/LinkAlbCommand");

//PromiseChainなので各処理は外だししてコマンド化（Promiseを返してくれれば良い）し、
//コマンドをどうアセンブルするかって作りに変えれる（はず）

exports.createVPC = function (que,apiKey,apiPwd) {
    AWS.config.setPromisesDependency(Promise);
    try {
        let config = null;
        if(apiKey==null&&apiPwd==null){
            config={region: que.vpc.region};
        }else{
            config = {
                region: que.vpc.region,
                accessKeyId: apiKey,
                secretAccessKey: apiPwd,

            };
        }

        const client = new AWS.EC2(config);


        const managementTag = {};
        que.vpc.tags.map(function(tag){
                managementTag[tag.name]=tag.value;
            }
        )

        const vpc = que.vpc;

        return vpc.prepare(config , client , vpc).then(function(){
            console.log("9.Parallel.Start");
            return Promise.all(
                que.vpc.subnets.map(function (subnet,index) {
                    console.log("10-" + index + ".Subnet");
                    return client.createSubnet({
                        VpcId: vpc.VpcId,
                        AvailabilityZone :subnet.AvailabilityZone,
                        CidrBlock: subnet.cidr,
                    }).promise().then(function (subNetDataRet) {
                        console.log("11-" + index + ".Subnet.MapPublicIpOnLaunch(if necessary)");
                        subnet.SubnetId=subNetDataRet.Subnet.SubnetId;
                        subnet.attached=true;
                        if(subnet.attachIgw) {
                            return client.modifySubnetAttribute({
                                SubnetId: subnet.SubnetId,
                                MapPublicIpOnLaunch: {Value: true},
                            }).promise();
                        }
                    }).then(function () {
                        console.log("12-" + index + ".Subnet.Tags");
                        return client.createTags({
                            Resources: [subnet.SubnetId],
                            Tags: vpc.tags.concat({Key: "Name", Value: subnet.subnetName}),
                        }).promise();
                    }).then(function () {
                        console.log("13-" + index + ".Subnet <-> Route(if necessary)");
                        if(subnet.attachIgw){
                            return client.associateRouteTable({
                                SubnetId: subnet.SubnetId,
                                RouteTableId: que.vpc.RouteTableId,
                            }).promise();
                        }
                    });
                }
            ))
        }).then(function () {
            return Promise.resolve(function () {
                console.log("51.SecurityGroup");
            }).then(function () {
                return Promise.all(
                    que.vpc.securityGroups.map(function (group, index) {
                        console.log("51-" + index + ".SecurityGroup");
                        return client.createSecurityGroup({
                            GroupName: group.GroupName,
                            Description: group.Description,
                            VpcId: que.vpc.VpcId,
                        }).promise().then(function (securityDataRet) {
                            console.log("52-" + index + ".SecurityGroup.Tags");
                            group.GroupId = securityDataRet.GroupId;
                            group.attached = true;
                            return client.createTags({
                                Resources: [group.GroupId],
                                Tags: vpc.tags.concat({Key: "Name", Value: group.GroupName}),
                            }).promise();
                        });
                    })
                )
            }).then(function () {
                return Promise.all(
                    que.vpc.securityGroups.map(function (group, index) {
                        console.log("53-" + index + ".SecurityGroup.Ingresses");
                        return Promise.all(
                            group.ingress.map(function (ing, t) {
                                console.log("54-" + index + "-" + t + ".SecurityGroup.Ingress");

                                if (ing.toMyGroup === true||ing.toOtherGroup!=null) {
                                    let targetGroupId = ing.toMyGroup ? group.GroupId
                                                        : getSgId(que , ing.toOtherGroup);
                                    return client.authorizeSecurityGroupIngress({
                                        GroupId: group.GroupId,
                                        IpPermissions: [
                                            {
                                                FromPort: ing.FromPort,
                                                IpProtocol: ing.IpProtocol,
                                                ToPort: ing.ToPort,
                                                UserIdGroupPairs: [
                                                    {
                                                        Description: "to m group",
                                                        GroupId: targetGroupId,
                                                    }
                                                ]
                                            }
                                        ]
                                    }).promise();
                                } else {
                                    return client.authorizeSecurityGroupIngress({
                                        GroupId: group.GroupId,
                                        IpProtocol: ing.IpProtocol,
                                        FromPort: ing.FromPort,
                                        ToPort: ing.ToPort,
                                        CidrIp: ing.CidrIp,
                                    }).promise();
                                }
                            })
                        )}
                    )
                )
            })
        }).then(function () {
            console.log("100.LoadBalancer+AutoScaleAp");
            const subnetIds = getSubnetIds(que,que.vpc.lb.subnets);
            const psubnetIds = getSubnetIds(que,que.vpc.ap.subnets);
            const sgIds =getSgIds(que,que.vpc.lb.securityGroup);

            return alb.prepare(config , que.vpc.lb , subnetIds, sgIds,que.vpc.VpcId)
            .then(function () {
                return Promise.all(vpc.apps.map(
                    function(app,aindex){
                        console.log("200." + aindex + ".APP.AP.LINK");
                        return linkAlb.link(config,que.app.ap, psubnetIds, sgIds)
                    .then(function(){
                        console.log("200." + aindex + ".APP.AP.AP.AS");
                        return autoScale.prepare(config,que.app.ap, psubnetIds, sgIds);
                    })}
                )
            )});
        }).catch(function(err){
            // 上のいずれかでエラーが発生した。
            console.log(err);
        });
    } catch (err) {
        console.error(err);
    }
}

function getEC2Ids(que , names){
    let ec2Ids = [];
    names.forEach(function (name) {
        ec2Ids.push(getEC2Id(que,name));
    })
    return ec2Ids;
}

function getEC2Id(que , name){
    const ec = que.vpc.ec2s.find( ec => ec.name==name );
    return ec.InstanceId;
}

function getSubnetIds(que , names){
    console.log(JSON.stringify(names));
    let subnetIds = [];
    names.forEach(function (name) {
        subnetIds.push(getSubnetId(que,name));
    })
    return subnetIds;
}

function getSubnetId(que , name){
    const subnet = que.vpc.subnets.find( subnet => subnet.subnetName==name );
    return subnet.SubnetId;
}

function getSgIds(que , names){
    let sgids = [];
    names.forEach(function (name) {
        sgids.push(getSgId(que , name));
    })
    return sgids;
}

function getSgId(que , name){
    const sg = que.vpc.securityGroups.find( sg => name==sg.GroupName );
    return sg.GroupId;
}