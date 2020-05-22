//1VPC M SubNet 1IGW構成
const EC2 = require("aws-sdk/clients/ec2");
const ELB = require("aws-sdk/clients/elb")
const AWS = require('aws-sdk');
const ec2Command = require('./ec2/EC2Command');
const lbCommand = require('./lb/LbCommand');
const vpc = require('./network/VpcCommand');

//PromiseChainなので各処理は外だししてコマンド化（Promiseを返してくれれば良い）し、
//コマンドをどうアセンブルするかって作りに変えれる（はず）

exports.createVPC = function (que,apiKey,apiPwd) {
    AWS.config.setPromisesDependency(Promise);
    try {
        let ec2 = null;
        let elb = null;
        if(apiKey==null&&apiPwd==null){
            ec2 = new AWS.EC2({apiVersion: que.vpc.apiVersion , region: que.vpc.region});
            elb = new AWS.ELB({region: que.vpc.region});
        }else{
            ec2 = new AWS.EC2({
                apiVersion: que.vpc.apiVersion , region: que.vpc.region,
                accessKeyId: apiKey,
                secretAccessKey: apiPwd,

            });
            elb = new AWS.ELB({
                region: que.vpc.region,
                accessKeyId: apiKey,
                secretAccessKey: apiPwd,

            });
        }

        const managementTag = {};
        que.vpc.tags.map(function(tag){
                managementTag[tag.name]=tag.value;
            }
        )

        return vpc.prepare(ec2 , que.vpc).then(function(){
            console.log("9.Parallel.Start");
            return Promise.all(
                que.vpc.subnets.map(function (subnet,index) {
                    console.log("10-" + index + ".Subnet");
                    return ec2.createSubnet({
                        VpcId: que.vpc.VpcId,
                        AvailabilityZone :subnet.AvailabilityZone,
                        CidrBlock: subnet.cidr,
                    }).promise().then(function (subNetDataRet) {
                        console.log("11-" + index + ".Subnet.MapPublicIpOnLaunch(if necessary)");
                        subnet.SubnetId=subNetDataRet.Subnet.SubnetId;
                        subnet.attached=true;
                        if(subnet.attachIgw) {
                            return ec2.modifySubnetAttribute({
                                SubnetId: subnet.SubnetId,
                                MapPublicIpOnLaunch: {Value: true},
                            }).promise();
                        }
                    }).then(function () {
                        console.log("12-" + index + ".Subnet.Tags");
                        return ec2.createTags({
                            Resources: [subnet.SubnetId],
                            Tags: [
                                {Key: "Name", Value: subnet.subnetName},
                                {Key: "tenant", Value: "suzuki"},
                                {Key: "landscape", Value: "suzuki"}
                            ]
                        }).promise();
                    }).then(function () {
                        console.log("13-" + index + ".Subnet <-> Route(if necessary)");
                        if(subnet.attachIgw){
                            return ec2.associateRouteTable({
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
                        return ec2.createSecurityGroup({
                            GroupName: group.GroupName,
                            Description: group.Description,
                            VpcId: que.vpc.VpcId,
                        }).promise().then(function (securityDataRet) {
                            console.log("52-" + index + ".SecurityGroup.Tags");
                            group.GroupId = securityDataRet.GroupId;
                            group.attached = true;
                            return ec2.createTags({
                                Resources: [group.GroupId],
                                Tags: [
                                    {Key: "Name", Value: group.GroupName},
                                    {Key: "tenant", Value: "suzuki"},
                                    {Key: "landscape", Value: "suzuki"}
                                ]
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
                                    return ec2.authorizeSecurityGroupIngress({
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
                                    return ec2.authorizeSecurityGroupIngress({
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
            return Promise.all(
                que.vpc.ec2s.map(function (ec) {
                    const subnetId = getSubnetId(que , ec.SubnetName);
                    const sgids = getSgIds(que,ec.SecurityGroupNames);
                    return ec2Command.createEC2Command(ec2,ec,subnetId,sgids);
                })
            )
        }).then(function () {
            if(que.vpc.lb.need){
                console.log("100.LoadBalancer");
                const subnetIds = getSubnetIds(que,que.vpc.lb.subnets);
                const sgIds =getSgIds(que,que.vpc.lb.securityGroup);
                const ecsIds=getEC2Ids(que,que.vpc.lb.ec2s);
                lbCommand.lbPrepare(elb,que.vpc.lb ,subnetIds,sgIds, ecsIds );
            }
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