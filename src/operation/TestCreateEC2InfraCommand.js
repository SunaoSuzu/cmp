const requestQue = {
  vpc: {
    name: "sunao-vpc",
    cidr: "172.20.0.0/16",
    apiVersion: "2016-11-15",
    region: "ap-northeast-1",
    igw: { need: true, defaultGateWay: "0.0.0.0/0", name: "sunao-igw" },
    lb: {
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
    },
    subnets: [
      {
        subnetName: "sunao-public-subnet-ap-northeast-1a",
        AvailabilityZone: "ap-northeast-1a",
        cidr: "172.20.1.0/28",
        attachIgw: true,
        type: "public",
        role: "app",
        tags: [
          { name: "tenant", value: "suzuki" },
          { name: "landscape", value: "suzuki" },
        ],
      },
      {
        subnetName: "sunao-public-subnet-ap-northeast-1c",
        AvailabilityZone: "ap-northeast-1c",
        cidr: "172.20.2.0/28",
        attachIgw: true,
        type: "public",
        role: "app",
        tags: [
          { name: "tenant", value: "suzuki" },
          { name: "landscape", value: "suzuki" },
        ],
      },
      {
        subnetName: "sunao-private-subnet-ap-northeast-1a",
        publicSubnetName: "sunao-public-subnet-ap-northeast-1a",
        AvailabilityZone: "ap-northeast-1a",
        cidr: "172.20.3.0/28",
        attachIgw: false,
        natGateWay: false,
        type: "private",
        role: "app",
        tags: [
          { name: "tenant", value: "suzuki" },
          { name: "landscape", value: "suzuki" },
        ],
      },
      {
        subnetName: "sunao-private-subnet-ap-northeast-1c",
        publicSubnetName: "sunao-public-subnet-ap-northeast-1c",
        AvailabilityZone: "ap-northeast-1c",
        cidr: "172.20.4.0/28",
        attachIgw: false,
        natGateWay: false,
        type: "private",
        role: "app",
        tags: [
          { name: "tenant", value: "suzuki" },
          { name: "landscape", value: "suzuki" },
        ],
      },
    ],
    securityGroups: [
      {
        GroupName: "sunao-sg-web-publish",
        Description: "for web-publish of ap",
        ingress: [
          { IpProtocol: "TCP", FromPort: 80, ToPort: 80, CidrIp: "0.0.0.0/0" },
        ],
      },
    ],
    ec2:[],
    aec2s: [
      {
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
          { name: "tenant", value: "suzuki" },
          { name: "landscape", value: "suzuki" },
        ],
        add: true,
        attached: false,
      },
    ],
    tags: [
      { name: "tenant", value: "suzuki" },
      { name: "landscape", value: "suzuki" },
    ],
    add: true,
    attached: false,
  },
};

let command = require("./CreateEC2InfraCommand");
command.createVPC(requestQue, null, null); //defaultのkey/pwdを利用
