const requestQue = {
  vpc: {
    name: "suzu01-vpc",
    hostedZone: "suzu01.sutech.internal",
    subDomain: "suzu01",
    cidr: "172.20.0.0/16",
    apiVersion: "2016-11-15",
    region: "ap-northeast-1",
    igw: { need: true, defaultGateWay: "0.0.0.0/0", name: "suzu01-igw" },
    lb: {
      name: "suzu01-lb",
      alb: true,
      subnets: ["suzu01-public-subnet-1a", "suzu01-public-subnet-1c"],
      securityGroup: ["suzu01-sg-web-publish"],
      tags: [
        { Key: "tenant", Value: "test-suzu" },
        { Key: "landscape", Value: "test-suzu" },
      ],
    },
    subnets: [
      {
        subnetName: "suzu01-public-subnet-bastion",
        AvailabilityZone: "ap-northeast-1a",
        cidr: "172.20.5.0/28",
        attachIgw: true,
        role: "bastion",
        tags: [
          { Key: "tenant", Value: "test-suzu" },
          { Key: "landscape", Value: "test-suzu" },
        ],
      },
      {
        subnetName: "suzu01-public-subnet-1a",
        AvailabilityZone: "ap-northeast-1a",
        cidr: "172.20.1.0/28",
        attachIgw: true,
        type: "public",
        role: "app",
        tags: [
          { Key: "tenant", Value: "test-suzu" },
          { Key: "landscape", Value: "test-suzu" },
        ],
      },
      {
        subnetName: "suzu01-public-subnet-1c",
        AvailabilityZone: "ap-northeast-1c",
        cidr: "172.20.2.0/28",
        attachIgw: true,
        type: "public",
        role: "app",
        tags: [
          { Key: "tenant", Value: "test-suzu" },
          { Key: "landscape", Value: "test-suzu" },
        ],
      },
      {
        subnetName: "suzu01-private-subnet-1a",
        publicSubnetName: "suzu01-public-subnet-1a",
        AvailabilityZone: "ap-northeast-1a",
        cidr: "172.20.3.0/28",
        attachIgw: false,
        natGateWay: false,
        type: "private",
        role: "app",
        tags: [
          { Key: "tenant", Value: "test-suzu" },
          { Key: "landscape", Value: "test-suzu" },
        ],
      },
      {
        subnetName: "suzu01-private-subnet-1c",
        publicSubnetName: "suzu01-public-subnet-1c",
        AvailabilityZone: "ap-northeast-1c",
        cidr: "172.20.4.0/28",
        attachIgw: false,
        natGateWay: false,
        type: "private",
        role: "app",
        tags: [
          { Key: "tenant", Value: "test-suzu" },
          { Key: "landscape", Value: "test-suzu" },
        ],
      },
    ],
    securityGroups: [
      {
        GroupName: "suzu01-sg-bastion",
        Description: "for bastion ec2",
        ingress: [
          { toMyGroup: true, IpProtocol: "TCP", FromPort: 22, ToPort: 22 },
          {
            IpProtocol: "TCP",
            FromPort: 22,
            ToPort: 22,
            CidrIp: "118.240.151.69/32",
          },
        ],
      },
      {
        GroupName: "suzu01-sg-ssh-from-bastion",
        Description: "for ssh from bastion",
        ingress: [
          {
            toOtherGroup: "suzu01-sg-bastion",
            IpProtocol: "TCP",
            FromPort: 22,
            ToPort: 22,
          },
        ],
      },
      {
        GroupName: "suzu01-sg-web-publish",
        Description: "for web-publish of ap",
        ingress: [
          { IpProtocol: "TCP", FromPort: 80, ToPort: 80, CidrIp: "0.0.0.0/0" },
          {
            IpProtocol: "TCP",
            FromPort: 443,
            ToPort: 443,
            CidrIp: "0.0.0.0/0",
          },
        ],
      },
    ],
    ec2s: [],
    apps: [
      {
        ap: {
          domain: "suzu01-app0.sutech.co.jp",
          internalDomain: "app0-ap.suzu01.sutech.internal",
          healthCheckUrl: "/index.html",
          min: 1,
          max: 1,
          autoScale: true,
          alb: true,
          name: "suzu01-app0-ap",
          SecurityGroupNames: [
            "suzu01-sg-web-publish",
            "suzu01-sg-ssh-from-bastion",
          ],
          launch: {
            ImageId: "ami-03e4521d84f084007",
            InstanceType: "t2.micro",
            KeyName: "sunao",
            InstanceMonitoring: { Enabled: false },
          },
          subnets: ["suzu01-private-subnet-1a", "suzu01-private-subnet-1c"],
          tags: [
            { Key: "tenant", Value: "test-suzu" },
            { Key: "landscape", Value: "test-suzu" },
          ],
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
          add: true,
          attached: false,
        },
        db: {
          internalDomain: "app0-db.suzu01.sutech.internal",
          name: "suzu01-app0-db",
          SecurityGroupNames: [
            "suzu01-sg-web-publish",
            "suzu01-sg-ssh-from-bastion",
          ],
          SubnetName: "suzu01-private-subnet-1a",
          launch: {
            ImageId: "ami-03e4521d84f084007",
            InstanceType: "t2.micro",
            KeyName: "sunao",
            BlockDeviceMappings: [
              {
                DeviceName: "/dev/sdg",
                Ebs: { VolumeSize: "1", VolumeType: "gp2" },
              },
            ],
          },
          efs: true,
          tags: [
            { Key: "tenant", Value: "test-suzu" },
            { Key: "landscape", Value: "test-suzu" },
          ],
        },
        bs: {
          internalDomain: "app0-bs.suzu01.sutech.internal",
          name: "suzu01-app0-bs",
          SecurityGroupNames: [
            "suzu01-sg-web-publish",
            "suzu01-sg-ssh-from-bastion",
          ],
          SubnetName: "suzu01-private-subnet-1a",
          launch: {
            ImageId: "ami-03e4521d84f084007",
            InstanceType: "t2.micro",
            KeyName: "sunao",
          },
          tags: [
            { Key: "tenant", Value: "test-suzu" },
            { Key: "landscape", Value: "test-suzu" },
          ],
        },
        search: {
          internalDomain: "app0-search.suzu01.sutech.internal",
          name: "suzu01-app0-search",
          SecurityGroupNames: [
            "suzu01-sg-web-publish",
            "suzu01-sg-ssh-from-bastion",
          ],
          SubnetName: "suzu01-private-subnet-1a",
          launch: {
            ImageId: "ami-03e4521d84f084007",
            InstanceType: "t2.micro",
            KeyName: "sunao",
          },
          tags: [
            { Key: "tenant", Value: "test-suzu" },
            { Key: "landscape", Value: "test-suzu" },
          ],
        },
      },
    ],
    bastions: [
      {
        name: "suzu01-ec2-ap-bastion",
        internalDomain: "bastion.suzu01.sutech.internal",
        launch: {
          ImageId: "ami-0db8ca4897909ac37",
          InstanceType: "t2.micro",
          KeyName: "sunao",
        },
        SecurityGroupNames: ["suzu01-sg-bastion"],
        SubnetName: "suzu01-public-subnet-bastion",
        tags: [
          { Key: "tenant", Value: "test-suzu" },
          { Key: "landscape", Value: "test-suzu" },
        ],
        components: [],
        add: true,
        attached: false,
      },
    ],
    tags: [
      { Key: "tenant", Value: "test-suzu" },
      { Key: "landscape", Value: "test-suzu" },
    ],
    add: true,
    attached: false,
  },
};

let command = require("./EnvironmentCreator");
command.createVPC(requestQue, null, null); //defaultのkey/pwdを利用
