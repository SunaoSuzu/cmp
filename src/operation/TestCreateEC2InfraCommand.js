
const requestQue = {
    vpc :                 {
        name : "sunao-vpc",
        apiVersion : '2016-11-15',
        region : "ap-northeast-1",
        cidr : "172.20.0.0/16",
        subnets : [
            {subnetName : "sunao-public", AvailabilityZone : "ap-northeast-1d" , cidr : "172.20.1.0/28", MapPublicIpOnLaunch : true , attachIgw : true},
            {subnetName : "sunao-private", AvailabilityZone : "ap-northeast-1c" , cidr : "172.20.2.0/28", MapPublicIpOnLaunch : true , attachIgw : false},
        ],
        igw : { need : true , defaultGateWay : "0.0.0.0/0", name : "sunao-igw" },
        securityGroups : [
            {
                GroupName:"sunao",
                Description : "sunao",
                ingress : [
                    {
                        IpProtocol: "TCP",
                        FromPort: 22,
                        ToPort: 22,
                        CidrIp: "118.240.151.69/32",
                    },
                    {
                        IpProtocol: "TCP",
                        FromPort: 22,
                        ToPort: 22,
                        CidrIp: "153.246.130.192/32",
                    },
                    {
                        toMyGroup : true,
                        IpProtocol: "TCP",
                        FromPort: 22,
                        ToPort: 22,
                    },
                ]
            },
        ],
        ec2s :[
            {
                name : "sunao-public",
                ImageId: "ami-0db8ca4897909ac37",
                InstanceType: 't2.micro',
                KeyName: "sunao",
                SecurityGroupNames: ["sunao"],
                SubnetName: "sunao-public",
            },
            {
                name : "sunao-private",
                ImageId: "ami-0db8ca4897909ac37",
                InstanceType: 't2.micro',
                KeyName: "sunao",
                SecurityGroupNames: ["sunao"],
                SubnetName: "sunao-private",
            },
        ]
    },

}

let command = require("./CreateEC2InfraCommand");
command.createVPC(requestQue,null,null); //defaultのkey/pwdを利用