
const command = require("./AutoScalingCommand");
const albCommand = require("../lb/AlbCommand");
const config  = {region : "ap-northeast-1"};
const ec =      {
    min: 1,
    max: 1,
    autoScale: true,
    name: "sunao-ec2-ap",
    ImageId: "ami-03e4521d84f084007",
    InstanceType: "t2.micro",
    KeyName: "sunao",
    SecurityGroupNames: ["sunao-sg-web-publish"],
    SubnetNames: [
        "sunao-private-subnet-ap-northeast-1a",
        "sunao-private-subnet-ap-northeast-1c",
    ],
    tags: [
        { Key: "tenant", Value: "suzuki" },
        { Key: "landscape", Value: "suzuki" },
    ],
    add: true,
    attached: false,
};

const subnetIds = ["subnet-0ec6bec3c4ba40c67","subnet-03541dfdd913b5c80"];
const publicSubnetIds = ["subnet-0144f9910af2eec75","subnet-0bfe457dfae6992ca"];
const sgIds = ["sg-01b3902a2f3e78d62"];

const lb = {
    need: false,
    name: "sunao-lb",
    type: 2,
    subnets: [
        "sunao-public-subnet-ap-northeast-1a",
        "sunao-public-subnet-ap-northeast-1c",
    ],
    autoScalingGroup: "sunao-ec2-ap",
    ec2s: [],
    securityGroup: ["sunao-sg-web-publish"],
}

albCommand.prepare(config , lb , publicSubnetIds, sgIds,"vpc-06171a428965f1c69").then(function () {
    command.prepare(config,ec, subnetIds, sgIds , lb["targetGroupArn"]);
});

