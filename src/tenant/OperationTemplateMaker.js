//作業を割り出す
import getConfiguration from "../Configuration";
import {pattern} from "../conf/EnvirornmentPattern";
import * as Strategy from  "../conf/Strategy";
import * as SecurityGroup  from  "../conf/SecurityGroup";

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
            managmgentTag.push({ name: tenantTag, value: tenant.awsTag });
        }
        if (envTag !== "") {
            managmgentTag.push({ name: envTag, value: environment.awsTag });
        }
    }

    //かなりハードコーディング
    const namePrefix = "sunao";
    const apiVersion = '2016-11-15';
    const region     = "ap-northeast-1";
    const availabilityZones = ["ap-northeast-1a","ap-northeast-1c","ap-northeast-1d"];
    const amiForAP      = "ami-03e4521d84f084007";
    const amiForBatison = "ami-0db8ca4897909ac37";
    const ec2KeyName    = "sunao";

    const strategy = environment.strategy;

    if (environment.vpcType === 1) {
        //
        resources = {
            name : namePrefix + "-vpc",
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
        const minimumAz = strategy.web.minimumAz; //maximum までAZ作るのが正しい予感・・
        const publicSubnets = [];
        const publicSubnetNames = [];
        const privateSubnets = [];
        const apSecurityGroups = [];
        const apEc2s = [];
        const apEc2Names = [];
        let lb = {};

        //lbだろうが、httpdだろうが、web用のsgを作る
        const webSecurityGroupName  = namePrefix + "-sg-web-publish";
        const webSecurityIngressPtn = SecurityGroup.ApIngressPattern.http;
        const webSecurityGroup      = {
            GroupName   : webSecurityGroupName,
            Description : "for web-publish of ap",
            ingress : webSecurityIngressPtn,
        };
        apSecurityGroups.push(webSecurityGroup);

        //lbだろうが、httpdだろうが、public subnetを作る
        for (let i = 0; i < minimumAz; i++) {
            const subnetName = namePrefix + "-public-subnet-" + availabilityZones[i];
            const subnet = {
                subnetName : subnetName,
                AvailabilityZone : availabilityZones[i] ,
                cidr : "172.20." + ( ++counter ) + ".0/28" ,
                attachIgw : true,
                role : "app",
                tags : managmgentTag,
            }
            publicSubnets.push(subnet);
            publicSubnetNames.push(subnetName);
        }

        //lbの場合にはprivate Subnetを作る
        if(strategy.web.publishing===Strategy.WEB_PUB_ALB
            ||strategy.web.publishing===Strategy.WEB_PUB_ELB){
            for (let i = 0; i < minimumAz; i++) {
                const subnetName = namePrefix + "-private-subnet-" + availabilityZones[i];
                const subnet = {
                    subnetName: subnetName,
                    AvailabilityZone: availabilityZones[i],
                    cidr: "172.20." + (++counter) + ".0/28",
                    attachIgw: false,
                    role: "app",
                    tags: managmgentTag,
                }
                privateSubnets.push(subnet);
            }
        }

        //ECを作ってサブネットに置く
        const targetSubnests = strategy.web.publishing===Strategy.WEB_PUB_DIRECT ?
            publicSubnets : privateSubnets;
        targetSubnests.forEach(function(subnet){
            const ec2Name = namePrefix + "-ec2-ap-" + subnet.AvailabilityZone;
            const ec2 = {
                name         : ec2Name,
                ImageId      : amiForAP,
                InstanceType : 't2.micro',
                KeyName      : ec2KeyName,
                SecurityGroupNames: [webSecurityGroupName],
                SubnetName: subnet.subnetName,
                tags:managmgentTag,
                components:environment.mainComponents,
                add:true,
                attached:false,
            }
            apEc2s.push(ec2);
            apEc2Names.push(ec2Name);
            operations.push({
                command: CREATE_EC2,
                target: ec2,
            });
        })

        //LBがいる場合にはlb作って、publicSubnetに置いて、privateSubnetにあるEC2とアタッチする様にする
        if(strategy.web.publishing===Strategy.WEB_PUB_ALB
            ||strategy.web.publishing===Strategy.WEB_PUB_ELB) {
            lb = {
                need : true,
                name : namePrefix + "-vpc",
                type : strategy.web.publishing,
                subnets : publicSubnetNames,
                ec2s : apEc2Names,
                securityGroup : [webSecurityGroupName],
            }
        } else {
            //Lb不要を宣言
            lb.need = false;
        }


        //DBなど

        //組み立て
        resources.subnets=resources.subnets.concat(publicSubnets).concat(privateSubnets);
        resources.ec2s=resources.ec2s.concat(apEc2s);
        resources.securityGroups=resources.securityGroups.concat(apSecurityGroups);
        resources.lb = lb;

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
            resources.ec2s.forEach(function (ins){
                console.log(JSON.stringify(ins));

                ins.SecurityGroupNames.push(ec2SecurityGroupName);
            })


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
}
export default OperationTemplateMaker;
