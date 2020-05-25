//作業を割り出す
import getConfiguration from "../Configuration";
import * as Strategy from  "../conf/Strategy";
import * as SecurityGroup  from  "../conf/SecurityGroup";
import {DomainSetting} from "../conf/Domain";
import {Region} from "../conf/Region";

//後でどこかに移すだろう
const CREATE_VPC = "CREATE_VPC";
const CREATE_EC2 = "CREATE_EC2";

//Operationsは多分不要
function OperationTemplateMaker(tenant, environment) {
    const conf = getConfiguration();
    let resources = [];
    let operations = [];

    //共通タグ（参照渡しになってるからコピーしないとマズイ予感）
    const tagUsage = conf.tagUsage;
    const tenantTag = tagUsage.tenant;
    const envTag = tagUsage.environment;
    let managmgentTag = [];
    if (tagUsage) {
        if (tenantTag !== "") {
            managmgentTag.push({ Key: tenantTag, Value: tenant.awsTag });
        }
        if (envTag !== "") {
            managmgentTag.push({ Key: envTag, Value: environment.awsTag });
        }
    }

    //かなりハードコーディング
    const apiVersion = '2016-11-15';
    const region     = Region.name;
    const availabilityZones = Region.az;

    //Productから動的に取る様にいずれ直す
    const amiForAP      = "ami-03e4521d84f084007";
    const amiForBatison = "ami-0db8ca4897909ac37";
    const ec2KeyName    = "sunao";

    const subDomain  = environment.subDomain;
    const rootDomain = DomainSetting.default.url;
    const domain     = subDomain + "." + rootDomain;
    const namePrefix = subDomain;

    const strategy = environment.strategy;

    //
    resources = {
        name : namePrefix + "-vpc",
        domain : domain,
        subDomain : subDomain,
        cidr:"172.20.0.0/16" ,
        apiVersion:apiVersion,
        region:region,
        igw : { need : true , defaultGateWay : "0.0.0.0/0", name : namePrefix + "-igw" },
        lb : {},
        subnets : [],
        securityGroups : [],
        ec2s : [],
        tags: managmgentTag , add: true , attached: false};
    operations.push({
        command: CREATE_VPC,
        target: resources,
    });

    let counter = 0;

    //aboutAp
    const aznum = strategy.network.az; //maximum までAZ作るのが正しい予感・・
    const publicSubnets = [];
    const publicSubnetNames = [];
    const privateSubnets = [];
    const privateSubnetNames = [];
    const apSecurityGroups = [];
    const apEc2s = [];
    const apEc2Names = [];
    let lb = {};

    //web用のsgを作る(lbとapで分けるべきかも)
    const webSecurityGroupName  = namePrefix + "-sg-web-publish";
    const webSecurityIngressPtn = SecurityGroup.ApIngressPattern.both;
    const webSecurityGroup      = {
        GroupName   : webSecurityGroupName,
        Description : "for web-publish of ap",
        ingress : webSecurityIngressPtn,
    };
    apSecurityGroups.push(webSecurityGroup);

    //public subnetを作る
    for (let i = 0; i < aznum ; i++) {
        const subnetName = namePrefix + "-public-subnet-" + Region.azShortName[i];
        const subnet = {
            subnetName : subnetName,
            AvailabilityZone : availabilityZones[i] ,
            cidr : "172.20." + ( ++counter ) + ".0/28" ,
            attachIgw : true,
            type : "public",
            role : "app",
            tags : managmgentTag,
        }
        publicSubnets.push(subnet);
        publicSubnetNames.push(subnetName);
    }
    //ペアになるprivate subnetを作る
    publicSubnets.forEach(function (psub , i) {
        const subnetName = namePrefix + "-private-subnet-" + Region.azShortName[i];
        const subnet = {
            subnetName: subnetName,
            publicSubnetName : psub.subnetName,
            AvailabilityZone: availabilityZones[i],
            cidr: "172.20." + (++counter) + ".0/28",
            attachIgw: false,
            natGateWay : strategy.network.natgateway,
            type : "private",
            role: "app",
            tags: managmgentTag,
        }
        privateSubnets.push(subnet);
        privateSubnetNames.push(subnetName);
    })

    //APをpublicに置くのか、privateに置くのか決めて、AutoScalingGroupを作る
    //AWS::AutoScaling::LaunchConfiguration
    //AWS::AutoScaling::AutoScalingGroup
    //AWS::ElasticLoadBalancingV2::TargetGroup


    const targetSubnests = strategy.web.publishing===Strategy.WEB_PUB_DIRECT ?
        publicSubnets : privateSubnets;

    //mainComponent毎にAPを作る
    const ap = {
        domain       : subDomain + "_app." + rootDomain,
        min          : 1,
        max          : 1,
        autoScale    : true,
        alb          : true,
        name         : namePrefix + "_app",
        SecurityGroupNames: [webSecurityGroupName],
        launch : {
            ImageId      : amiForAP,
            InstanceType : 't2.micro',
            KeyName      : ec2KeyName,
            InstanceMonitoring: {Enabled:false}
        },
        subnets: privateSubnetNames,
        tags:managmgentTag,
        components:environment.mainComponents,
        add:true,
        attached:false,
    }

    lb = {
        name : namePrefix + "-lb",
        alb : true,
        subnets : publicSubnetNames,
        securityGroup : [webSecurityGroupName],
        tags : managmgentTag,
    }
    //DBなど

    //組み立て
    resources.subnets=resources.subnets.concat(publicSubnets).concat(privateSubnets);
    resources.securityGroups=resources.securityGroups.concat(apSecurityGroups);
    resources.lb = lb;
    resources.ap = ap;

    //about bastion（最後に処理すべき）
    if(strategy.bastion.create===1){
        //Bastion用の外からSSHできるSG（複数bastion同士を考慮してグループ内のSSHも可能）
        //各EC2はBastionのSGからSSHできるSGを足す

        const bastionSecurityGroupName  = namePrefix + "-sg-bastion";
        const bastionSecurityGroup      = {
            GroupName   : bastionSecurityGroupName,
            Description : "for bastion ec2",
            ingress : [
                {
                    toMyGroup : true,
                    IpProtocol: "TCP",
                    FromPort: 22,
                    ToPort: 22,
                },
            ],
        };
        strategy.bastion.accessFroms.split(",").forEach(
            function (ip) {
                bastionSecurityGroup.ingress.push({
                    IpProtocol: "TCP",
                    FromPort: 22,
                    ToPort: 22,
                    CidrIp: ip,
                });
            }
        );
        resources.securityGroups.push(bastionSecurityGroup);

        const ec2SecurityGroupName  = namePrefix + "-sg-ssh-from-bastion";
        const ec2SecurityGroup      = {
            GroupName   : ec2SecurityGroupName,
            Description : "for ssh from bastion",
            ingress : [
                {
                    toOtherGroup : bastionSecurityGroupName,
                    IpProtocol: "TCP",
                    FromPort: 22,
                    ToPort: 22,
                },
            ],
        }
        resources.securityGroups.push(ec2SecurityGroup);
        ap.SecurityGroupNames.push(ec2SecurityGroupName);

        //結構処理サボってる
        //とりあえずサブネット作る（もったいないから共有する設定を後から持つ）
        const subnetName = namePrefix + "-public-subnet-bastion";
        const subnet = {
            subnetName : subnetName,
            AvailabilityZone : availabilityZones[0] ,
            cidr : "172.20." + ( ++counter ) + ".0/28" ,
            attachIgw : true,
            role : "bastion",
            tags : managmgentTag,
        }
        resources.subnets.push(subnet);
        const ec2Name = namePrefix + "-ec2-ap-bastion";
        const ec2 = {
            name         : ec2Name,
            ImageId      : amiForBatison,
            InstanceType : 't2.micro',
            KeyName      : ec2KeyName,
            SecurityGroupNames: [bastionSecurityGroupName],
            SubnetName: subnetName,
            tags:managmgentTag,
            components:[],
            add:true,
            attached:false,
        }
        resources.ec2s.push(ec2);
        operations.push({
            command: CREATE_EC2,
            target: ec2,
        });
    }

    return { resources, operations };
}
export default OperationTemplateMaker;
