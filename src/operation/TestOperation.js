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
    const ec2 = new AWS.EC2({apiVersion: API_VERSION});
    console.log("Created VPC");
    ec2.createVpc(VPC_PARAMS, function (err, vpcData) {
        if (err) console.log(err, err.stack);
        else console.log(vpcData);           // successful response

        console.log("Created SUBNET");
        const subNetParams = {
            VpcId: vpcData.Vpc.VpcId,
            CidrBlock: CIDR_BLOCK_SUBNET,
        };
        const subNetPromise = ec2.createSubnet(subNetParams, function (err, subNetData) {
            if (err) console.log(err, err.stack);
            else console.log(subNetData);           // successful response
            /*
          Subnet: {
            AvailabilityZone: 'ap-northeast-1a',
            AvailabilityZoneId: 'apne1-az4',
            AvailableIpAddressCount: 11,
            CidrBlock: '172.20.1.0/28',
            DefaultForAz: false,
            MapPublicIpOnLaunch: false,
            State: 'pending',
            SubnetId: 'subnet-0fc2f108cc82c4b7f',
            VpcId: 'vpc-0887595c7f9b158d1',
            OwnerId: '510229950882',
            AssignIpv6AddressOnCreation: false,
            Ipv6CidrBlockAssociationSet: [],
            Tags: [],
            SubnetArn: 'arn:aws:ec2:ap-northeast-1:510229950882:subnet/subnet-0fc2f108cc82c4b7f'
          }
             */
            console.log("Created Internet Gateway");
            const internetGatewayPromise = ec2.createInternetGateway(function (err, igwData) {
                if (err) console.log(err, err.stack);
                else console.log(igwData);           // successful response
                const attachParams = {
                    VpcId: vpcData.Vpc.VpcId,
                    InternetGatewayId: igwData.InternetGateway.InternetGatewayId,
                };
                console.log("Attach Internet Gateway");
                ec2.attachInternetGateway(attachParams, function (err, attachData) {
                    if (err) console.log(err, err.stack);
                    else console.log(attachData);           // successful response
                });
                console.log("Create Routetable");
                const routeParams = {
                    VpcId: vpcData.Vpc.VpcId,
                };
                ec2.createRouteTable(routeParams, function (err, routeData) {
                    if (err) console.log(err, err.stack);
                    else console.log(routeData);           // successful response
                    const routeTableParams = {
                        RouteTableId: routeData.RouteTable.RouteTableId,
                        DestinationCidrBlock: "0.0.0.0/0",
                        GatewayId: igwData.InternetGateway.InternetGatewayId,
                    };
                    console.log("Create Route");
                    ec2.createRoute(routeTableParams, function (err, routeData) {
                        if (err) console.log(err, err.stack);
                        else console.log(routeData);
                    });
                    console.log("Associate Routetable");
                    const associateParams = {
                        SubnetId: subNetData.Subnet.SubnetId,
                        RouteTableId: routeData.RouteTable.RouteTableId,
                    };
                    ec2.associateRouteTable(associateParams, function (err, associateData) {
                        if (err) console.log(err, err.stack);
                        else console.log(associateData);
                    });
                    console.log("Modify Subnet Attribute");
                    const modifyParams = {
                        SubnetId: subNetData.Subnet.SubnetId,
                        MapPublicIpOnLaunch: {Value: true},
                    };
                    ec2.modifySubnetAttribute(modifyParams, function (err, modifyData) {
                        if (err) console.log(err, err.stack);
                        else console.log(modifyData);
                    });
                    console.log("Create SecurityGroup");
                    const securityParams = {
                        GroupName: vpcData.Vpc.VpcId,
                        Description: vpcData.Vpc.VpcId,
                        VpcId: vpcData.Vpc.VpcId,
                    };
                    ec2.createSecurityGroup(securityParams, function (err, securityData) {
                        if (err) console.log(err, err.stack);
                        else console.log(securityData);
                        const authorizedParams = {
                            GroupId: securityData.GroupId,
                            protocols: "TCP",
                            port: 22,
                            cidr: "126.99.207.13/21",
                        }
                        ec2.authorizeSecurityGroupIngress(authorizedParams, function (err, authorizedData) {
                            if (err) console.log(err, err.stack);
                            else console.log(authorizedData);
                            console.log("Run Instance");
                            const INSTANCE_PARAMS = {
                                ImageId: "ami-0db8ca4897909ac37",
                                InstanceType: 't2.micro',
                                KeyName: "for-api-servlet",
                                MinCount: 1,
                                MaxCount: 1,
                                SecurityGroupIds: [securityData.GroupId],
                                SubnetId: subNetData.Subnet.SubnetId,
                            };
                            ec2.runInstances(INSTANCE_PARAMS, function (err, instanceData) {
                                if (err) console.log(err, err.stack);
                                else console.log(instanceData);
                                console.log("Create Tags");
                                const tagParams = {
                                    Resources: [vpcData.Vpc.VpcId],
                                    Tags: [
                                        {Key: "Name", Value: "This name is attached from js"},
                                        {Key: "tenant", Value: "from test"},
                                        {Key: "local", Value: "from local"}
                                    ]
                                };
                                const tagPromise = ec2.createTags(tagParams, function (err, tagData) {
                                    if (err) console.log(err, err.stack);
                                    else console.log(tagData);
                                });
                            });
                        });
                    });
                });

            });

        });
    });
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
