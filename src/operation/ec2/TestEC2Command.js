let que = {
    "vpc": {
        "name": "sunao-vpc",
        "apiVersion": "2016-11-15",
        "region": "ap-northeast-1",
        "cidr": "172.20.0.0/16",
        "tags": [{"name": "tenant", "value": "suzuki"}],
        "subnets": [{
            "subnetName": "sunao-public",
            "AvailabilityZone": "ap-northeast-1d",
            "cidr": "172.20.1.0/28",
            "attachIgw": true,
            "SubnetId": "subnet-03debe480358b004d",
            "attached": true
        }, {
            "subnetName": "sunao-private",
            "AvailabilityZone": "ap-northeast-1d",
            "cidr": "172.20.2.0/28",
            "attachIgw": false,
            "SubnetId": "subnet-0da43e4017ca35103",
            "attached": true
        }],
        "lb": {"need": false},
        "igw": {
            "need": true,
            "defaultGateWay": "0.0.0.0/0",
            "name": "sunao-igw",
            "InternetGatewayId": "igw-02cda0b20b88b6507",
            "attached": true
        },
        "securityGroups": [{
            "GroupName": "sunao",
            "Description": "sunao",
            "ingress": [{
                "IpProtocol": "TCP",
                "FromPort": 22,
                "ToPort": 22,
                "CidrIp": "118.240.151.69/32"
            }, {"IpProtocol": "TCP", "FromPort": 80, "ToPort": 80, "CidrIp": "0.0.0.0/0"}, {
                "IpProtocol": "TCP",
                "FromPort": 22,
                "ToPort": 22,
                "CidrIp": "153.246.130.192/32"
            }, {"toMyGroup": true, "IpProtocol": "TCP", "FromPort": 22, "ToPort": 22}],
            "GroupId": "sg-0d8db7063e31dc60e",
            "attached": true
        }],
        "ec2s": [{
            "name": "sunao-public",
            "ImageId": "ami-03e4521d84f084007",
            "InstanceType": "t2.micro",
            "KeyName": "sunao",
            "SecurityGroupNames": ["sunao"],
            "SubnetName": "sunao-public",
            "UserData": "#!/bin/bash\necho `hostname` >> /usr/share/nginx/html/index.html"
        }, {
            "name": "sunao-private",
            "ImageId": "ami-03e4521d84f084007",
            "InstanceType": "t2.micro",
            "KeyName": "sunao",
            "SecurityGroupNames": ["sunao"],
            "SubnetName": "sunao-private",
            "UserData": "#!/bin/bash\necho `hostname` >> /usr/share/nginx/html/index.html"
        }],
        "VpcId": "vpc-01ef6dcafef308dbd",
        "attached": true,
        "RouteTableId": "rtb-09fdf924606e25b1b",
        "RouteTableAttached": true
    }
}
let ec = {
    "name": "sunao-public",
    "ImageId": "ami-03e4521d84f084007",
    "InstanceType": "t2.micro",
    "KeyName": "sunao",
    "SecurityGroupNames": ["sunao"],
    "SubnetName": "sunao-public",
    "UserData": "#!/bin/bash\necho `hostname` >> /usr/share/nginx/html/index.html"
}
const EC2 = require("aws-sdk/clients/ec2");
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(Promise);

let command = require("./EC2Command");
const ec2 = new AWS.EC2({region: que.vpc.region});

const subnetId = getSubnetId(que , ec.SubnetName);
const sgids = getSgIds(que,ec.SecurityGroupNames);

const promise = command.createEC2Command(ec2,ec,subnetId,sgids);
console.log("end");

function getSubnetId(que , name){
    que.vpc.subnets.forEach(function (subnet) {
        if(subnet.subnetName==name){
            return subnet.SubnetId;
        }
    })
}

function getSgIds(que , names){
    let sgids = [];
    names.forEach(function (name) {
        sgids.push(getSgId(que , name));
    })
    return sgids;
}

function getSgId(que , name){
    que.vpc.securityGroups.forEach(function (sg) {
        if(name==sg.GroupName){
            return sg.GroupId;
        }
    })
}
