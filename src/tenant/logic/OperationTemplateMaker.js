//作業を割り出す
import getConfiguration from "../../Configuration";
import * as SecurityGroup  from "../../conf/SecurityGroup";
import DomainSetting from "../../conf/Domain";
import Region from "../../conf/Region";
import Products from "../../conf/Products";

//Operationsは多分不要
function OperationTemplateMaker(tenant, environment) {
    const conf = getConfiguration();
    let resources = [];
    let operations = [];

    //共通タグ（参照渡しになってるからコピーしないとマズイ予感）
    const tagUsage = conf.tagUsage;
    const tenantTag = tagUsage.tenant;
    const envTag = tagUsage.environment;
    let managementTag = [];
    if (tagUsage) {
        if (tenantTag !== "") {
            managementTag.push({ Key: tenantTag, Value: tenant.awsTag });
        }
        if (envTag !== "") {
            managementTag.push({ Key: envTag, Value: environment.awsTag });
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
        stack : "vpc",
        hostedZone : subDomain + "." + internalDomainRoot,
        subDomain : subDomain,
        cidr:"172.20.0.0/16" ,
        apiVersion:apiVersion,
        region:region,
        igw : { need : true , defaultGateWay : "0.0.0.0/0", name : namePrefix + "-igw",stack : "igw", },
        lb : {},
        subnets : [],
        securityGroups : [],
        ec2s : [],
        apps : [],
        bastions : [],
        nat  : strategy.network.nat,
        tags: managementTag , add: true , attached: false
    };

    let counter = 0;

    //aboutAp
    const aznum = strategy.network.az;
    const publicSubnets = [];
    const publicSubnetNames = [];
    const publicSubnetStacks = [];
    const privateSubnets = [];
    const privateSubnetNames = [];
    const privateSubnetStacks = [];
    const apSecurityGroups = [];
    let lb = {};

    //web用のsgを作る(lbとapで分けるべきかも)
    const webSecurityGroupName  = namePrefix + "-sg-web-publish";
    const webSecurityIngressPtn = SecurityGroup.ApIngressPattern.both;
    const webSecurityGroup      = {
        stack : "webSecurityGroupName",
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
            stack : "publicSubnet" + i,
            AvailabilityZone : availabilityZones[i] ,
            cidr : "172.20." + ( ++counter ) + ".0/28" ,
            attachIgw : true,
            type : "public",
            role : "app",
            nat  : strategy.network.nat,
            tags : managementTag,
        }
        publicSubnets.push(subnet);
        publicSubnetNames.push(subnetName);
        publicSubnetStacks.push(subnet.stack);
    }
    //ペアになるprivate subnetを作る
    publicSubnets.forEach(function (psub , i) {
        const subnetName = namePrefix + "-private-subnet-" + Region.azShortName[i];
        const subnet = {
            subnetName: subnetName,
            stack : "privateSubnet" + i,
            publicSubnetName : psub.subnetName,
            publicSubnetStack : psub.stack,
            AvailabilityZone: availabilityZones[i],
            cidr: "172.20." + (++counter) + ".0/28",
            attachIgw: false,
            nat : strategy.network.nat,
            type : "private",
            role: "app",
            tags: managementTag,
        }
        privateSubnets.push(subnet);
        privateSubnetNames.push(subnetName);
        privateSubnetStacks.push(subnet.stack);
    })

    //about bastion（最後に処理すべき）
    let sshSgName = null;
    let sshSgStack = null;
    if(strategy.bastion.create===1){
        //Bastion用の外からSSHできるSG（複数bastion同士を考慮してグループ内のSSHも可能）
        //各EC2はBastionのSGからSSHできるSGを足す
        const amiForBastion = "ami-0db8ca4897909ac37";
        const keyForBastion = "sunao";
        const typeForBastion = 't2.micro';

        const bastionSecurityGroupName  = namePrefix + "-sg-bastion";
        const bastionSecurityGroup      = {
            stack : "bastionSecurityGroup",
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
            stack : "sshFromBastion",
            Description : "for ssh from bastion",
            ingress : [
                {
                    toOtherGroup : bastionSecurityGroupName,
                    toOtherGroupStack : bastionSecurityGroup.stack,
                    IpProtocol: "TCP",
                    FromPort: 22,
                    ToPort: 22,
                },
            ],
        }
        sshSgStack=sshSg.stack;
        resources.securityGroups.push(sshSg);

        //結構処理サボってる
        //とりあえずサブネット作る（もったいないから共有する設定を後から持つ）
        const subnetName = namePrefix + "-public-subnet-bastion";
        const subnet = {
            subnetName : subnetName,
            stack : "BastionSubnet",
            AvailabilityZone : availabilityZones[0] ,
            cidr : "172.20." + ( ++counter ) + ".0/28" ,
            attachIgw : true,
            role : "bastion",
            tags : managementTag,
        }
        resources.subnets.push(subnet);
        const ec2Name = namePrefix + "-ec2-ap-bastion";
        const ec2 = {
            name         : ec2Name,
            stack : "BastionEc2",
            internalDomain    : "bastion." + subDomain  + "." + internalDomainRoot,
            launch : {
                ImageId      : amiForBastion,
                InstanceType : typeForBastion,
                KeyName      : keyForBastion,
            },
            SecurityGroupNames: [bastionSecurityGroupName],
            SubnetName: subnetName,
            securityGroupStack: [bastionSecurityGroup.stack],
            subnetStack: subnet.stack,
            tags:managementTag,
            add:true,
            attached:false,
        }
        resources.bastions.push(ec2);
    }

    //mainComponent毎にAPを作る
    const apps = [];
    environment.mainComponents.forEach(function (product,i) {
        //Productから動的に取る様にいずれ直す
        const config = Products(product.id);

        const ap = {
            stack             : config.ap.stack,
            domain            : subDomain +  config.suffix + "." + rootDomain,
            internalDomain    : config.ap.sn + "." +  subDomain + "." + internalDomainRoot,
            healthCheckUrl    : config.ap.healthCheckUrl,
            min               : 1,
            max               : 1,
            autoScale         : true,
            alb               : true,
            name              : namePrefix + config.ap.sn,
            SecurityGroupNames: [webSecurityGroupName],
            subnets: privateSubnetNames,
            securityGroupStack: [webSecurityGroup.stack],
            subnetsStack: privateSubnetStacks,
            launch : {...config.ap.launch },
            tags:managementTag,
            add:true,
            attached:false,
        }

        const db = {
            stack             : config.db.stack,
            internalDomain    : config.db.sn + "." +  subDomain + "." + internalDomainRoot,
            name              : namePrefix + config.db.sn,
            launch : {...config.db.launch },
            SecurityGroupNames: [webSecurityGroupName],
            SubnetName : privateSubnetNames[0] ,
            securityGroupStack: [webSecurityGroup.stack],
            subnetStack: privateSubnets[0].stack,
            efs : true,
            efsDomain: subDomain +  config.db.suffix + "." + internalDomainRoot,
            tags:managementTag,
        }

        const bs = {
            stack             : config.bs.stack,
            internalDomain    : config.bs.sn + "." +  subDomain + "." + internalDomainRoot,
            name              : namePrefix + config.bs.sn,
            launch : {...config.bs.launch },
            SecurityGroupNames: [webSecurityGroupName],
            SubnetName : privateSubnetNames[0] ,
            securityGroupStack: [webSecurityGroup.stack],
            subnetStack: privateSubnets[0].stack,
            tags:managementTag,
        }

        const search = {
            stack             : config.ss.stack,
            internalDomain    : config.ss.sn + "." +  subDomain + "." + internalDomainRoot,
            name              : namePrefix + config.ss.sn,
            launch : {...config.ss.launch },
            SecurityGroupNames: [webSecurityGroupName],
            SubnetName : privateSubnetNames[0] ,
            securityGroupStack: [webSecurityGroup.stack],
            subnetStack: privateSubnets[0].stack,
            tags:managementTag,
        }

        const efs = {
            stack             : config.efs.stack,
            internalDomain    : config.efs.sn + "." +  subDomain + "." + internalDomainRoot,
            name              : namePrefix + config.efs.sn,
            launch : {...config.efs.launch },
            SubnetNames : privateSubnetNames ,
            subnetsStack: privateSubnetStacks,
            tags:managementTag,
        }

        if(sshSgName!=null)ap.SecurityGroupNames.push(sshSgName);
        if(sshSgName!=null)db.SecurityGroupNames.push(sshSgName);
        if(sshSgName!=null)bs.SecurityGroupNames.push(sshSgName);
        if(sshSgName!=null)search.SecurityGroupNames.push(sshSgName);
        if(sshSgStack!=null)ap.securityGroupStack.push(sshSgStack);
        if(sshSgStack!=null)db.securityGroupStack.push(sshSgStack);
        if(sshSgStack!=null)bs.securityGroupStack.push(sshSgStack);
        if(sshSgStack!=null)search.securityGroupStack.push(sshSgStack);

        apps.push({ product : product ,ap : ap, db : db , bs : bs, search : search , efs : efs });
    })

    lb = {
        stack             : "ALB",
        name : namePrefix + "-lb",
        alb : true,
        subnets : publicSubnetNames,
        subnetStacks : publicSubnetStacks,
        securityGroup : [webSecurityGroupName],
        securityGroupStack : [webSecurityGroup.stack],
        tags : managementTag,
    }

    //組み立て
    resources.subnets=resources.subnets.concat(publicSubnets).concat(privateSubnets);
    resources.securityGroups=resources.securityGroups.concat(apSecurityGroups);
    resources.lb = lb;
    resources.apps = apps;

    return { resources, operations };
}
export default OperationTemplateMaker;
