
const requestQue = {
    vpc :                         {
        name : "sunao-vpc",
        apiVersion : '2016-11-15',
        region : "ap-northeast-1",
        cidr : "172.20.0.0/16",  //
        tags : [{ name : "tenant" , value : "suzuki"}],
        subnets : [
            {subnetName : "sunao-public",  AvailabilityZone : "ap-northeast-1d" , cidr : "172.20.1.0/28" , attachIgw : true},
            {subnetName : "sunao-private", AvailabilityZone : "ap-northeast-1d" , cidr : "172.20.2.0/28", attachIgw : false},
        ],
        lb  : { need :false },
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
                        FromPort: 80,
                        ToPort: 80,
                        CidrIp: "0.0.0.0/0",
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
                ImageId: "ami-03e4521d84f084007",
                InstanceType: 't2.micro',
                KeyName: "sunao",
                SecurityGroupNames: ["sunao"],
                SubnetName: "sunao-public",
                UserData : "#!/bin/bash\necho `hostname` >> /usr/share/nginx/html/index.html",
            },
            {
                name : "sunao-private",
                ImageId: "ami-03e4521d84f084007",
                InstanceType: 't2.micro',
                KeyName: "sunao",
                SecurityGroupNames: ["sunao"],
                SubnetName: "sunao-private",
                UserData : "#!/bin/bash\necho `hostname` >> /usr/share/nginx/html/index.html",
            },
        ]
    }
}

let command = require("./CreateEC2InfraCommand");
command.createVPC(requestQue,null,null); //defaultのkey/pwdを利用