var EC2 = require("aws-sdk/clients/ec2");

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

  const ec2 = new EC2({
    //AccessKey/PWDはとりあえずDefaultを使ってくれるから不要
    region: "ap-northeast-1",
  });

  //Tag用の情報
  let tags = [{ Key: "Name", Value: vpc.vpcName }];
  vpc.tags.map(function (tag) {
    tags.push({ Key: tag.name, Value: tag.value });
  });

  const vpcParams = {
    CidrBlock: "10.0.0.0/16",
  };

  ec2
    .createVpc(vpcParams)
    .promise()
    .then(function (vpcInstance) {
      const createTagParams = {
        Resources: [vpcInstance.Vpc.VpcId],
        Tags: tags,
      };

      //Tag付ける
      ec2
        .createTags(createTagParams)
        .promise()
        .then(function (data) {
          console.log("できた");
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpc-property
  //CLIの例（メソッド構造はjsとほぼ同様）https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-subnets-commands-example.html
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
