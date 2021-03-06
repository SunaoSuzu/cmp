exports.convert = function (vpc) {
    const resources = {};
    vpc.securityGroups.forEach(function (sg, index) {
        resources[sg.stack]={
            "Type": "AWS::EC2::SecurityGroup",
            "Properties": {
                "VpcId": {
                    "Ref": vpc.stack
                },
                "Tags": vpc.tags.concat({Key: "Name", Value: sg.GroupName}),
                GroupName: sg.GroupName,
                GroupDescription: sg.Description,
            }
        }
    })
    vpc.securityGroups.forEach(function (sg, index) {
        sg.ingress.forEach(function (ing, t) {
            if (ing.toMyGroup === true||(ing.toOtherGroup!==null&&ing.toOtherGroup!==undefined)) {
                const targetGroup = ing.toMyGroup ? sg.stack : ing.toOtherGroupStack;
                resources[sg.stack + "Ingress" + t]={
                    "Type": "AWS::EC2::SecurityGroupIngress",
                    "Properties": {
                        "GroupId": {
                            "Ref": sg.stack
                        },
                        "IpProtocol": ing.IpProtocol,
                        "FromPort": ing.FromPort,
                        "ToPort": ing.ToPort,
                        "SourceSecurityGroupId": {
                            "Ref": targetGroup
                        }
                    }
                }
            }else{
                resources[sg.stack + "Ingress" + t]= {
                    "Type": "AWS::EC2::SecurityGroupIngress",
                    "Properties": {
                        "GroupId": {
                            "Ref": sg.stack
                        },
                        "IpProtocol": ing.IpProtocol,
                        "FromPort": ing.FromPort,
                        "ToPort": ing.ToPort,
                        CidrIp: ing.CidrIp,
                    }
                }
            }
        })
    })
    return resources;
}