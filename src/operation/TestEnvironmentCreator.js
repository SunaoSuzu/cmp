const requestQue = {
  vpc: {
    add: true,
    subDomain: "suzu01",
    tags: [
      { Value: "test-suzu", Key: "tenant" },
      { Value: "test-suzu", Key: "landscape" },
    ],
    ap: {
      add: true,
      subnets: ["suzu01-private-subnet-1a", "suzu01-private-subnet-1c"],
      components: [
        {
          name: "SpringBootAp",
          caption: "SpringBootAp",
          id: 99,
          type: 1,
          params: [],
          strategy: {
            batch: {},
            search: {},
            version: { no: 100 },
            db: {},
            ap: { type: 1, lb: { kind: 1 } },
          },
        },
      ],
      min: 1,
      max: 1,
      alb: true,
      domain: "suzu01_app.sutech.co.jp",
      name: "suzu01_app",
      attached: false,
      SecurityGroupNames: ["suzu01-sg-web-publish"],
      launch: {
        ImageId: "ami-03e4521d84f084007",
        KeyName: "sunao",
        InstanceType: "t2.micro",
        InstanceMonitoring: { Enabled: false },
      },
      autoScale: true,
      tags: [
        { Value: "test-suzu", Key: "tenant" },
        { Value: "test-suzu", Key: "landscape" },
      ],
    },
    ec2s: [],
    apiVersion: "2016-11-15",
    lb: {
      name: "suzu01-lb",
      subnets: ["suzu01-public-subnet-1a", "suzu01-public-subnet-1c"],
      securityGroup: ["suzu01-sg-web-publish"],
      alb: true,
      tags: [
        { Value: "test-suzu", Key: "tenant" },
        { Value: "test-suzu", Key: "landscape" },
      ],
    },
    domain: "suzu01.sutech.co.jp",
    name: "suzu01-vpc",
    igw: { name: "suzu01-igw", need: true, defaultGateWay: "0.0.0.0/0" },
    attached: false,
    cidr: "172.20.0.0/16",
    subnets: [
      {
        role: "app",
        attachIgw: true,
        AvailabilityZone: "ap-northeast-1a",
        cidr: "172.20.1.0/28",
        type: "public",
        subnetName: "suzu01-public-subnet-1a",
        tags: [
          { Value: "test-suzu", Key: "tenant" },
          { Value: "test-suzu", Key: "landscape" },
        ],
      },
      {
        role: "app",
        attachIgw: true,
        AvailabilityZone: "ap-northeast-1c",
        cidr: "172.20.2.0/28",
        type: "public",
        subnetName: "suzu01-public-subnet-1c",
        tags: [
          { Value: "test-suzu", Key: "tenant" },
          { Value: "test-suzu", Key: "landscape" },
        ],
      },
      {
        role: "app",
        natGateWay: false,
        attachIgw: false,
        AvailabilityZone: "ap-northeast-1a",
        cidr: "172.20.3.0/28",
        type: "private",
        publicSubnetName: "suzu01-public-subnet-1a",
        subnetName: "suzu01-private-subnet-1a",
        tags: [
          { Value: "test-suzu", Key: "tenant" },
          { Value: "test-suzu", Key: "landscape" },
        ],
      },
      {
        role: "app",
        natGateWay: false,
        attachIgw: false,
        AvailabilityZone: "ap-northeast-1c",
        cidr: "172.20.4.0/28",
        type: "private",
        publicSubnetName: "suzu01-public-subnet-1c",
        subnetName: "suzu01-private-subnet-1c",
        tags: [
          { Value: "test-suzu", Key: "tenant" },
          { Value: "test-suzu", Key: "landscape" },
        ],
      },
    ],
    securityGroups: [
      {
        GroupName: "suzu01-sg-web-publish",
        ingress: [
          { CidrIp: "0.0.0.0/0", IpProtocol: "TCP", FromPort: 80, ToPort: 80 },
          {
            CidrIp: "0.0.0.0/0",
            IpProtocol: "TCP",
            FromPort: 443,
            ToPort: 443,
          },
        ],
        Description: "for web-publish of ap",
      },
    ],
    region: "ap-northeast-1",
  },
};

let command = require("./EnvironmentCreator");
command.createVPC(requestQue, null, null); //defaultのkey/pwdを利用
