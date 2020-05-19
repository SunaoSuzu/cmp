var EC2 = require("aws-sdk/clients/ec2");
const AWS = require('aws-sdk');

const environment = {
    name: "開発環境",
    landScape: 1,
    status: 1,
    specLevel: 2,
    vpcType: 1,
    mainComponents: [
        {
            id: 99,
            name: "SpringBootAp",
            caption: "SpringBootAp",
            type: 1,
            params: [],
        },
    ],
    subComponents: [],
    awsTag: "develop",
    resources: {
        vpcName: "xxxx",
        tags: [
            {
                name: "tenant",
                value: "cmp-tenant-stech",
            },
            {
                name: "landscape",
                value: "develop",
            },
        ],
        add: true,
        attached: false,
        ec2: [
            {
                ec2Name: "xxx",
                instanceType: "t2.micro",
                tags: [
                    {
                        name: "tenant",
                        value: "cmp-tenant-stech",
                    },
                    {
                        name: "landscape",
                        value: "develop",
                    },
                ],
                components: [
                    {
                        id: 99,
                        name: "SpringBootAp",
                        caption: "SpringBootAp",
                        type: 1,
                        params: [],
                    },
                ],
                add: true,
                attached: false,
            },
        ],
    },
    operations: [
        {
            command: "CREATE_VPC",
            target: {
                vpcName: "xxxx",
                tags: [
                    {
                        name: "tenant",
                        value: "cmp-tenant-stech",
                    },
                    {
                        name: "landscape",
                        value: "develop",
                    },
                ],
                add: true,
                attached: false,
                ec2: [
                    {
                        ec2Name: "xxx",
                        instanceType: "t2.micro",
                        tags: [
                            {
                                name: "tenant",
                                value: "cmp-tenant-stech",
                            },
                            {
                                name: "landscape",
                                value: "develop",
                            },
                        ],
                        components: [
                            {
                                id: 99,
                                name: "SpringBootAp",
                                caption: "SpringBootAp",
                                type: 1,
                                params: [],
                            },
                        ],
                        add: true,
                        attached: false,
                    },
                ],
            },
        },
        {
            command: "CREATE_EC2",
            target: {
                ec2Name: "xxx",
                instanceType: "t2.micro",
                tags: [
                    {
                        name: "tenant",
                        value: "cmp-tenant-stech",
                    },
                    {
                        name: "landscape",
                        value: "develop",
                    },
                ],
                components: [
                    {
                        id: 99,
                        name: "SpringBootAp",
                        caption: "SpringBootAp",
                        type: 1,
                        params: [],
                    },
                ],
                add: true,
                attached: false,
            },
        },
    ],
};

const vpc = environment.resources;
if (vpc.add === true) {
    //VPC＋αを作る

    // const ec2 = new EC2({
    //   //AccessKey/PWDはとりあえずDefaultを使ってくれるから不要
    //   region: "ap-northeast-1",
    // });
    //
    // //Tag用の情報
    // let tags = [{ Key: "Name", Value: vpc.vpcName }];
    // vpc.tags.map(function (tag) {
    //   tags.push({ Key: tag.name, Value: tag.value });
    // });
    //
    // const vpcParams = {
    //   CidrBlock: "10.0.0.0/16",
    // };
    //
    // ec2
    //   .createVpc(vpcParams)
    //   .promise()
    //   .then(function (vpcInstance) {
    //     const createTagParams = {
    //       Resources: [vpcInstance.Vpc.VpcId],
    //       Tags: tags,
    //     };
    //
    //     //Tag付ける
    //     ec2
    //       .createTags(createTagParams)
    //       .promise()
    //       .then(function (data) {
    //         console.log("できた");
    //       })
    //       .catch((error) => console.log(error));
    //   })
    //   .catch((error) => console.log(error));

    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpc-property
    //CLIの例（メソッド構造はjsとほぼ同様）https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-subnets-commands-example.html
    const API_VERSION = '2016-11-15';
    const CIDR_BLOCK_VPC = "172.20.0.0/16";
    const CIDR_BLOCK_SUBNET = "172.20.1.0/28";
    const VPC_PARAMS = {
        CidrBlock: CIDR_BLOCK_VPC,
        AmazonProvidedIpv6CidrBlock: false,
        DryRun: false,
        InstanceTenancy: "default"
    };

    async function createVPC() {
        const ec2 = new AWS.EC2({apiVersion: API_VERSION});
        console.log("Created VPC");
        let vpcDataRet = await ec2.createVpc(VPC_PARAMS).promise();
        console.log(vpcDataRet);
        console.log("Created SUBNET");
        const subNetParams = {
            VpcId: vpcDataRet.Vpc.VpcId,
            CidrBlock: CIDR_BLOCK_SUBNET,
        };
        const subNetDataRet = await ec2.createSubnet(subNetParams).promise();
        console.log(subNetDataRet);
        console.log("Created Internet Gateway");
        const internetGatewayRet = await ec2.createInternetGateway().promise();
        console.log(internetGatewayRet);
        console.log("Attach Internet Gateway");
        const attachParams = {
            VpcId: vpcDataRet.Vpc.VpcId,
            InternetGatewayId: internetGatewayRet.InternetGateway.InternetGatewayId,
        };
        const attachDataRet = await ec2.attachInternetGateway(attachParams).promise();
        console.log(attachDataRet);
        console.log("Create Routetable");
        const routeParams = {
            VpcId: vpcDataRet.Vpc.VpcId,
        };
        const routeDataRet = await ec2.createRouteTable(routeParams).promise();
        console.log(routeDataRet);
        console.log("Create Route");
        const routeTableParams = {
            RouteTableId: routeDataRet.RouteTable.RouteTableId,
            DestinationCidrBlock: "0.0.0.0/0",
            GatewayId: internetGatewayRet.InternetGateway.InternetGatewayId,
        };
        const createRouteRet = await ec2.createRoute(routeTableParams).promise();
        console.log(createRouteRet);
        console.log("Associate Routetable");
        const associateParams = {
            SubnetId: subNetDataRet.Subnet.SubnetId,
            RouteTableId: routeDataRet.RouteTable.RouteTableId,
        };
        const associateRouteTableRet = await ec2.associateRouteTable(associateParams).promise();
        console.log(associateRouteTableRet);
        console.log("Modify Subnet Attribute");
        const modifyParams = {
            SubnetId: subNetDataRet.Subnet.SubnetId,
            MapPublicIpOnLaunch: {Value: true},
        };
        const modifySubnetAttributeRet = await ec2.modifySubnetAttribute(modifyParams).promise();
        console.log(modifySubnetAttributeRet);
        console.log("Create SecurityGroup");
        const securityParams = {
            GroupName: vpcDataRet.Vpc.VpcId,
            Description: vpcDataRet.Vpc.VpcId,
            VpcId: vpcDataRet.Vpc.VpcId,
        };
        const securityDataRet = await ec2.createSecurityGroup(securityParams).promise();
        console.log(securityDataRet);
        console.log("Authorize SecurityGroupIngress");
        const authorizedParams = {
            GroupId: securityDataRet.GroupId,
            protocols: "TCP",
            port: 22,
            cidr: "126.99.207.13/21",
        }
        const authorizeSecurityGroupIngressRet = await ec2.authorizeSecurityGroupIngress(authorizedParams).promise();
        console.log(authorizeSecurityGroupIngressRet);
        console.log("Run Instance");
        const INSTANCE_PARAMS = {
            ImageId: "ami-0db8ca4897909ac37",
            InstanceType: 't2.micro',
            KeyName: "for-api-servlet",
            MinCount: 1,
            MaxCount: 1,
            SecurityGroupIds: [securityDataRet.GroupId],
            SubnetId: subNetDataRet.Subnet.SubnetId,
        };
        const instanceRet = await ec2.runInstances(INSTANCE_PARAMS).promise();
        console.log(instanceRet);
        console.log("Create Tags");
        const tagParams = {
            Resources: [vpcDataRet.Vpc.VpcId],
            Tags: [
                {Key: "Name", Value: "This name is attached from js"},
                {Key: "tenant", Value: "from test"},
                {Key: "local", Value: "from local"}
            ]
        };
        const createTagRet = await ec2.createTags(tagParams).promise();
        console.log(createTagRet);
    }

    createVPC();
}

vpc.ec2.map(function (instance) {
    if (instance.add) {
        //上のVPC上にEC2を作って必要な設定を施していく
        //https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v2/developer-guide/ec2-example-creating-an-instance.html

        console.log("ec2:" + instance.instanceType);

        //EC2にタグを付ける（名前もタグ？）
        instance.tags.map(function (tag) {
            console.log("tag:" + tag.name + "=" + tag.value);
        });
    }
});

//ec2の上にプログラムを送り込む（AMIに保存されている想定であれば何もしない）
