//1VPC M SubNet 1IGW構成
const EC2 = require("aws-sdk/clients/ec2");
const ELB = require("aws-sdk/clients/elb")
const AWS = require('aws-sdk');


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

        return Promise.resolve(function () {
            console.log("1.VPC作成");
        }).then(function () {
            return ec2.createVpc({
                CidrBlock: que.vpc.cidr,
                AmazonProvidedIpv6CidrBlock: false,
                DryRun: false,
                InstanceTenancy: "default"
            }).promise();
        }).then(function (vpcDataRet) {
            console.log("1.VPC.TAG");
            que.vpc.VpcId=vpcDataRet.Vpc.VpcId;
            que.vpc.attached=true;
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
            que.vpc.igw.attached=true;
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
            que.vpc.RouteTableAttached=true;
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
                                    console.log("toMyGroup=" + ing.toMyGroup);
                                    console.log("ing.toOtherGroup=" + ing.toOtherGroup);
                                    let targetGroupId = null;
                                    if(ing.toMyGroup){
                                        targetGroupId=group.GroupId;
                                    }else{
                                        que.vpc.securityGroups.map(function (g){
                                            console.log("g.GroupId=" + g.GroupId);
                                            if (ing.toOtherGroup===g.GroupName){
                                                targetGroupId=g.GroupId;
                                            }
                                        })
                                    }
                                    console.log("targetGroupId=" + targetGroupId);
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
                que.vpc.ec2s.map(function (ec,index) {
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
                    let userDataEncoded = null;
                    if(ec.UserData!=null){
                        userDataEncoded = Buffer.from(ec.UserData, 'base64').toString();
                    }

                    return Promise.resolve(function () {
                        console.log("80-" + index + ".EC2");
                    }).then(function () {
                        console.log("81-" + index + ".EC2");
                        return ec2.runInstances({
                            ImageId: ec.ImageId,
                            InstanceType: ec.InstanceType,
                            KeyName: ec.KeyName,
                            MinCount: 1,
                            MaxCount: 1,
                            SecurityGroupIds: sgids,
                            SubnetId: subnetId,
                            UserData: ec.userDataEncoded,
                        }).promise();
                    }).then(function (instanceRet) {
                        console.log("82-" + index + ".EC2.Tags");
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
                            ec.attached=true;
                            ids.push(ec.InstanceId);
                        })
                        return ec2.createTags({
                            Resources: ids,
                            Tags: [
                                {Key: "Name", Value: ec.name},
                                {Key: "tenant", Value: "suzuki"},
                                {Key: "landscape", Value: "suzuki"}
                            ]
                        }).promise();

                    });
                })
            )
        }).then(function () {
            if(que.vpc.lb.need){
                console.log("100.LoadBalancer");
                let subnetIds = [];
                que.vpc.lb.subnets.forEach(function (sub) {
                    que.vpc.subnets.forEach(function (subnet) {
                        if(sub===subnet.subnetName){
                            subnetIds.push(subnet.SubnetId);
                        }
                    })
                })
                let sgId =[];
                que.vpc.lb.securityGroup.forEach(function (sg) {
                    que.vpc.securityGroups.forEach(function (group) {
                        if(sg===group.GroupName){
                            sgId.push(group.GroupId);
                        }
                    })
                })

                return elb.createLoadBalancer({
                    Listeners: [
                        {
                            InstancePort: 80,
                            InstanceProtocol: "HTTP",
                            LoadBalancerPort: 80,
                            Protocol: "HTTP"
                        }
                    ],
                    SecurityGroups: sgId ,
                    LoadBalancerName: que.vpc.lb.name,
                    Subnets: subnetIds,
                    Tags: [
                        {Key: "Name", Value: que.vpc.lb.name},
                        {Key: "tenant", Value: "suzuki"},
                        {Key: "landscape", Value: "suzuki"}
                    ]

                }).promise().then(function (){
                    
                })
            }
        }).catch(function(err){
            // 上のいずれかでエラーが発生した。
            console.log(err);
        });
    } catch (err) {
        console.error(err);
    }
}