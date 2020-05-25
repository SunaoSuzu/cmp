//作業を割り出す
import getConfiguration from "../Configuration";
import * as SecurityGroup  from  "../conf/SecurityGroup";
import DomainSetting from "../conf/Domain";
import Region from "../conf/Region";


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

    const subDomain  = environment.subDomain;
    const rootDomain = DomainSetting.default.url;
    const internalDomainRoot =DomainSetting.default.internal;
    const namePrefix = subDomain;

    const strategy = environment.strategy;

    //
    resources = {
        name : namePrefix + "-vpc",
        hostedZone : subDomain + "." + internalDomainRoot,
        subDomain : subDomain,
        cidr:"172.20.0.0/16" ,
        apiVersion:apiVersion,
        region:region,
        igw : { need : true , defaultGateWay : "0.0.0.0/0", name : namePrefix + "-igw" },
        lb : {},
        subnets : [],
        securityGroups : [],
        ec2s : [],
        apps : [],
        bastions : [],
        tags: managmgentTag , add: true , attached: false
    };

    let counter = 0;

    //aboutAp
    const aznum = strategy.network.az;
    const publicSubnets = [];
    const publicSubnetNames = [];
    const privateSubnets = [];
    const privateSubnetNames = [];
    const apSecurityGroups = [];
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

    //about bastion（最後に処理すべき）
    let sshSgName = null;
    if(strategy.bastion.create===1){
        //Bastion用の外からSSHできるSG（複数bastion同士を考慮してグループ内のSSHも可能）
        //各EC2はBastionのSGからSSHできるSGを足す
        const amiForBastion = "ami-0db8ca4897909ac37";
        const keyForBastion = "sunao";
        const typeForBastion = 't2.micro';

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

        sshSgName  = namePrefix + "-sg-ssh-from-bastion";
        const sshSg      = {
            GroupName   : sshSgName,
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
        resources.securityGroups.push(sshSg);

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
            internalDomain    : "bastion." + subDomain  + "." + internalDomainRoot,
            launch : {
                ImageId      : amiForBastion,
                InstanceType : typeForBastion,
                KeyName      : keyForBastion,
            },
            SecurityGroupNames: [bastionSecurityGroupName],
            SubnetName: subnetName,
            tags:managmgentTag,
            components:[],
            add:true,
            attached:false,
        }
        resources.bastions.push(ec2);
    }

    //mainComponent毎にAPを作る
    const apps = [];
    environment.mainComponents.forEach(function (product,i) {
        //Productから動的に取る様にいずれ直す
        const amiForAP      = "ami-03e4521d84f084007";
        const amiForDB      = "ami-03e4521d84f084007";
        const ec2KeyName    = "sunao";
        const healthCheckUrl ="/index.html";
        const ec2Type    = "t2.micro";
        const dbEc2Type    = "t2.micro";
        const ap = {
            domain            : subDomain + "-app" + i + "." + rootDomain,
            internalDomain    : "app" + i + "-ap." + subDomain  + "." + internalDomainRoot,
            healthCheckUrl    : healthCheckUrl,
            min               : 1,
            max               : 1,
            autoScale         : true,
            alb               : true,
            name              : namePrefix + "-app" + i + "-ap",
            SecurityGroupNames: [webSecurityGroupName],
            launch : {
                ImageId      : amiForAP,
                InstanceType : ec2Type,
                KeyName      : ec2KeyName,
                InstanceMonitoring: {Enabled:false}
            },
            subnets: privateSubnetNames,
            tags:managmgentTag,
            components:environment.mainComponents,
            add:true,
            attached:false,
        }

        const db = {
            internalDomain    : "app" + i + "-db." + subDomain  + "." + internalDomainRoot,
            name              : namePrefix + "-app" + i + "-db",
            SecurityGroupNames: [webSecurityGroupName],
            SubnetName : privateSubnetNames[0] ,
            launch: {
                ImageId      : amiForDB,
                InstanceType : dbEc2Type,
                KeyName      : ec2KeyName,
                BlockDeviceMappings : [
                    {DeviceName: "/dev/sdg" , Ebs:{VolumeSize:"1" , VolumeType: "gp2"}},
                ],
            },
            efs : true,
            tags:managmgentTag,
        }

        const bs = {
            internalDomain    : "app" + i + "-bs." + subDomain  + "." + internalDomainRoot,
            name              : namePrefix + "-app" + i + "-bs",
            SecurityGroupNames: [webSecurityGroupName],
            SubnetName : privateSubnetNames[0] ,
            launch: {
                ImageId      : amiForDB,
                InstanceType : dbEc2Type,
                KeyName      : ec2KeyName,
            },
            tags:managmgentTag,
        }

        const search = {
            internalDomain    : "app" + i + "-search." + subDomain  + "." + internalDomainRoot,
            name              : namePrefix + "-app" + i + "-search",
            SecurityGroupNames: [webSecurityGroupName],
            SubnetName : privateSubnetNames[0] ,
            launch: {
                ImageId      : amiForDB,
                InstanceType : dbEc2Type,
                KeyName      : ec2KeyName,
            },
            tags:managmgentTag,
        }
        if(sshSgName!=null)ap.SecurityGroupNames.push(sshSgName);
        if(sshSgName!=null)db.SecurityGroupNames.push(sshSgName);
        if(sshSgName!=null)bs.SecurityGroupNames.push(sshSgName);
        if(sshSgName!=null)search.SecurityGroupNames.push(sshSgName);
        apps.push({ ap : ap, db : db , bs : bs, search : search  });
    })

    lb = {
        name : namePrefix + "-lb",
        alb : true,
        subnets : publicSubnetNames,
        securityGroup : [webSecurityGroupName],
        tags : managmgentTag,
    }

    //組み立て
    resources.subnets=resources.subnets.concat(publicSubnets).concat(privateSubnets);
    resources.securityGroups=resources.securityGroups.concat(apSecurityGroups);
    resources.lb = lb;
    resources.apps = apps;

    return { resources, operations };
}
export default OperationTemplateMaker;
