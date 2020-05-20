//1VPC M SubNet 1IGW構成
const EC2 = require("aws-sdk/clients/ec2");
const AWS = require('aws-sdk');



exports.createVPC = function (que,apiKey,apiPwd) {
    try {
        let ec2 = null;

        if(apiKey==null&&apiPwd==null){
            ec2 = new AWS.EC2({apiVersion: que.vpc.apiVersion , region: que.vpc.region});
        }else{
            ec2 = new AWS.EC2({
                apiVersion: que.vpc.apiVersion , region: que.vpc.region,
                accessKeyId: apiKey,
                secretAccessKey: apiPwd,

            });
        }

        ec2.createVpc({
            CidrBlock: que.vpc.cidr,
            AmazonProvidedIpv6CidrBlock: false,
            DryRun: false,
            InstanceTenancy: "default"
        }).promise().then(function (vpcDataRet) {
            console.log("1.VPC作成");
            que.vpc.VpcId=vpcDataRet.Vpc.VpcId;
            return ec2.createTags({
                Resources: [que.vpc.VpcId],
                Tags: [
                    {Key: "Name", Value: que.vpc.name},
                    {Key: "tenant", Value: "suzuki"},
                    {Key: "landscape", Value: "suzuki"}
                ]
            }).promise();
        }).then(function (result) {
            console.log("2.InternetGateWay");
            return ec2.createInternetGateway().promise();
        }).then(function (internetGatewayRet) {
            console.log("3.InternetGateWay.Tags");
            que.vpc.igw.InternetGatewayId=internetGatewayRet.InternetGateway.InternetGatewayId;
            return ec2.createTags({
                Resources: [que.vpc.igw.InternetGatewayId],
                Tags: [
                    {Key: "Name", Value: que.vpc.igw.name},
                    {Key: "tenant", Value: "suzuki"},
                    {Key: "landscape", Value: "suzuki"}
                ]
            }).promise();
        }).then(function () {
            console.log("4.VPC <-> InternetGateWay");
            return ec2.attachInternetGateway({
                VpcId: que.vpc.VpcId,
                InternetGatewayId: que.vpc.igw.InternetGatewayId,
            }).promise();
        }).then(function (result) {
            console.log("5.RouteTable");
            return ec2.createRouteTable({
                VpcId: que.vpc.VpcId,
            }).promise();
        }).then(function (routeDataRet) {
            console.log("6.RouteTable.Tags");
            que.vpc.RouteTableId=routeDataRet.RouteTable.RouteTableId;
            return ec2.createTags({
                Resources: [que.vpc.RouteTableId],
                Tags: [
                    {Key: "Name", Value: que.vpc.name},
                    {Key: "tenant", Value: "suzuki"},
                    {Key: "landscape", Value: "suzuki"}
                ]
            }).promise();
        }).then(function () {
            console.log("7.Route:DefaultGateway");
            return ec2.createRoute({
                RouteTableId: que.vpc.RouteTableId,
                DestinationCidrBlock: que.vpc.igw.defaultGateWay,
                GatewayId: que.vpc.igw.InternetGatewayId,
            }).promise();
        }).then(function(){
            console.log("9.Parallel.Start");
            return Promise.all(
                que.vpc.subnets.map(function (subnet,index) {
                    console.log("10-" + index + ".Subnet");
                    return ec2.createSubnet({
                        VpcId: que.vpc.VpcId,
                        CidrBlock: subnet.cidr,
                    }).promise().then(function (subNetDataRet) {
                        console.log("11-" + index + ".Subnet.MapPublicIpOnLaunch(if necessary)");
                        subnet.SubnetId=subNetDataRet.Subnet.SubnetId;
                        if(subnet.attachIgw) {
                            return ec2.modifySubnetAttribute({
                                SubnetId: subnet.SubnetId,
                                MapPublicIpOnLaunch: {Value: subnet.MapPublicIpOnLaunch},
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
            return Promise.all(
                que.vpc.securityGroups.map(function (group,index) {
                    console.log("51-" + index + ".SecurityGroup");
                    return ec2.createSecurityGroup({
                        GroupName: group.GroupName,
                        Description: group.Description,
                        VpcId: que.vpc.VpcId,
                    }).promise().then(function (securityDataRet) {
                        console.log("52-" + index + ".SecurityGroup.Tags");
                        group.GroupId=securityDataRet.GroupId;
                        return ec2.createTags({
                            Resources: [group.GroupId],
                            Tags: [
                                {Key: "Name", Value: group.GroupName},
                                {Key: "tenant", Value: "suzuki"},
                                {Key: "landscape", Value: "suzuki"}
                            ]
                        }).promise();
                    }).then(function () {
                        console.log("53-" + index + ".SecurityGroup.Ingresses");
                        Promise.all(
                            group.ingress.map(function (ing, t) {
                                console.log("54-" + index + "-" + t + ".SecurityGroup.Ingress");
                                if(ing.toMyGroup===true){
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
                                                        GroupId: group.GroupId
                                                    }
                                                ]
                                            }
                                        ]
                                    }).promise();
                                }else{
                                    return ec2.authorizeSecurityGroupIngress({
                                        GroupId: group.GroupId,
                                        IpProtocol: ing.IpProtocol,
                                        FromPort: ing.FromPort,
                                        ToPort: ing.ToPort,
                                        CidrIp: ing.CidrIp,
                                    }).promise();
                                }
                            })
                        )
                    });
                })
            )
        }).then(function () {
            return Promise.all(
                que.vpc.ec2s.map(function (ec,index) {
                    console.log("80-" + index + ".EC2");
                    let subnetId = "";
                    que.vpc.subnets.forEach(function (subnet) {
                        if(subnet.subnetName==ec.SubnetName){
                            subnetId=subnet.SubnetId;
                        }
                    })
                    let sgids = [];
                    ec.SecurityGroupNames.forEach(function (name) {
                        que.vpc.securityGroups.forEach(function (sg) {
                            if(name==sg.GroupName){
                                sgids.push(sg.GroupId)
                            }
                        })
                    })
                    return ec2.runInstances({
                        ImageId: ec.ImageId,
                        InstanceType: ec.InstanceType,
                        KeyName: ec.KeyName,
                        MinCount: 1,
                        MaxCount: 1,
                        SecurityGroupIds: sgids,
                        SubnetId: subnetId,
                    }).promise().then(function (instanceRet) {
                        console.log("81-" + index + ".EC2.Tags");
                        const ids = [];
                        ec.InstanceIds=[];
                        instanceRet.Instances.forEach(function (instance , index) {
                            ec.InstanceId=instance.InstanceId;
                            ec.InstanceIds[index]=instance.InstanceId;
                            ec.PrivateIpAddress=instance.PrivateIpAddress;
                            ec.PublicIpAddress=instance.PublicIpAddress;
                            ec.SubnetId=instance.SubnetId;
                            ec.VpcId=instance.VpcId;
                            ec.VpcId=instance.Placement.AvailabilityZone;
                            ids.push(ec.InstanceId);
                        })
                        return ec2.createTags({
                            Resources: ids,
                            Tags: [
                                {Key: "Name", Value: ec.name},
                                {Key: "tenant", Value: "suzuki"},
                                {Key: "local", Value: "suzuki"}
                            ]
                        }).promise();

                    });
                })
            )

        });
    } catch (err) {
        console.error(err);
    }
}