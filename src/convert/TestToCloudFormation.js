
const requestQue = {
    vpc: {"name":"suzu-vpc","stack":"vpc","hostedZone":"suzu.sutech.internal","subDomain":"suzu","cidr":"172.20.0.0/16","apiVersion":"2016-11-15","region":"ap-northeast-1","igw":{"need":true,"defaultGateWay":"0.0.0.0/0","name":"suzu-igw","stack":"igw"},"lb":{"stack":"ALB","name":"suzu-lb","alb":true,"subnets":["suzu-public-subnet-1a","suzu-public-subnet-1c"],"subnetStacks":["publicSubnet0","publicSubnet1"],"securityGroup":["suzu-sg-web-publish"],"securityGroupStack":["webSecurityGroupName"],"tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}]},"subnets":[{"subnetName":"suzu-public-subnet-bastion","stack":"BastionSubnet","AvailabilityZone":"ap-northeast-1a","cidr":"172.20.5.0/28","attachIgw":true,"role":"bastion","tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}]},{"subnetName":"suzu-public-subnet-1a","stack":"publicSubnet0","AvailabilityZone":"ap-northeast-1a","cidr":"172.20.1.0/28","attachIgw":true,"type":"public","role":"app","tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}]},{"subnetName":"suzu-public-subnet-1c","stack":"publicSubnet1","AvailabilityZone":"ap-northeast-1c","cidr":"172.20.2.0/28","attachIgw":true,"type":"public","role":"app","tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}]},{"subnetName":"suzu-private-subnet-1a","stack":"privateSubnet0","publicSubnetName":"suzu-public-subnet-1a","AvailabilityZone":"ap-northeast-1a","cidr":"172.20.3.0/28","attachIgw":false,"natGateWay":false,"type":"private","role":"app","tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}]},{"subnetName":"suzu-private-subnet-1c","stack":"privateSubnet1","publicSubnetName":"suzu-public-subnet-1c","AvailabilityZone":"ap-northeast-1c","cidr":"172.20.4.0/28","attachIgw":false,"natGateWay":false,"type":"private","role":"app","tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}]}],"securityGroups":[{"stack":"bastionSecurityGroup","GroupName":"suzu-sg-bastion","Description":"for bastion ec2","ingress":[{"toMyGroup":true,"IpProtocol":"TCP","FromPort":22,"ToPort":22},{"IpProtocol":"TCP","FromPort":22,"ToPort":22,"CidrIp":"118.240.151.69/32"}]},{"GroupName":"suzu-sg-ssh-from-bastion","stack":"sshFromBastion","Description":"for ssh from bastion","ingress":[{"toOtherGroup":"suzu-sg-bastion","toOtherGroupStack":"bastionSecurityGroup","IpProtocol":"TCP","FromPort":22,"ToPort":22}]},{"stack":"webSecurityGroupName","GroupName":"suzu-sg-web-publish","Description":"for web-publish of ap","ingress":[{"IpProtocol":"TCP","FromPort":80,"ToPort":80,"CidrIp":"0.0.0.0/0"},{"IpProtocol":"TCP","FromPort":443,"ToPort":443,"CidrIp":"0.0.0.0/0"}]}],"ec2s":[],"apps":[{"product":{"name":"SpringBootAp","caption":"SpringBootAp","id":99,"type":1,"params":[],"strategy":{"batch":{},"search":{},"version":{"no":200},"db":{},"ap":{"type":1,"internalDns":"internal_sunao_ap.co.jp","lb":{"kind":2},"spec":2}}},"ap":{"stack":"RyoSpringAp","domain":"suzu-app0.sutech.co.jp","internalDomain":"app0-ap.suzu.sutech.internal","healthCheckUrl":"/index.html","min":1,"max":1,"autoScale":true,"alb":true,"name":"suzuapp0-ap","SecurityGroupNames":["suzu-sg-web-publish","suzu-sg-ssh-from-bastion"],"subnets":["suzu-private-subnet-1a","suzu-private-subnet-1c"],"securityGroupStack":["webSecurityGroupName","sshFromBastion"],"subnetsStack":["privateSubnet0","privateSubnet1"],"launch":{"ImageId":"ami-03e4521d84f084007","InstanceType":"t2.micro","KeyName":"sunao","InstanceMonitoring":{"Enabled":false}},"tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}],"add":true,"attached":false},"db":{"stack":"RyoSpringDb","internalDomain":"app0-db.suzu.sutech.internal","name":"suzuapp0-db","launch":{"ImageId":"ami-03e4521d84f084007","InstanceType":"t2.micro","KeyName":"sunao","BlockDeviceMappings":[{"DeviceName":"/dev/sdg","Ebs":{"VolumeSize":"1","VolumeType":"gp2"}}]},"SecurityGroupNames":["suzu-sg-web-publish","suzu-sg-ssh-from-bastion"],"SubnetName":"suzu-private-subnet-1a","securityGroupStack":["webSecurityGroupName","sshFromBastion"],"subnetStack":"privateSubnet0","efs":true,"efsDomain":"suzuundefined.sutech.internal","tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}]},"bs":{"stack":"RyoSpringBs","internalDomain":"app0-bs.suzu.sutech.internal","name":"suzuapp0-bs","launch":{"ImageId":"ami-03e4521d84f084007","InstanceType":"t2.micro","KeyName":"sunao"},"SecurityGroupNames":["suzu-sg-web-publish","suzu-sg-ssh-from-bastion"],"SubnetName":"suzu-private-subnet-1a","securityGroupStack":["webSecurityGroupName","sshFromBastion"],"subnetStack":"privateSubnet0","tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}]},"search":{"stack":"RyoSpringSS","internalDomain":"app0-ss.suzu.sutech.internal","name":"suzuapp0-ss","launch":{"ImageId":"ami-03e4521d84f084007","InstanceType":"t2.micro","KeyName":"sunao"},"SecurityGroupNames":["suzu-sg-web-publish","suzu-sg-ssh-from-bastion"],"SubnetName":"suzu-private-subnet-1a","securityGroupStack":["webSecurityGroupName","sshFromBastion"],"subnetStack":"privateSubnet0","tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}]},"efs":{"stack":"RyoSpringEFS","internalDomain":"efs.suzu.sutech.internal","name":"suzuefs","launch":{"PerformanceMode":"generalPurpose","Encrypted":"true"},"SubnetNames":["suzu-private-subnet-1a","suzu-private-subnet-1c"],"subnetsStack":["privateSubnet0","privateSubnet1"],"tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}]}}],"bastions":[{"name":"suzu-ec2-ap-bastion","stack":"BastionEc2","internalDomain":"bastion.suzu.sutech.internal","launch":{"ImageId":"ami-0db8ca4897909ac37","InstanceType":"t2.micro","KeyName":"sunao"},"SecurityGroupNames":["suzu-sg-bastion"],"SubnetName":"suzu-public-subnet-bastion","securityGroupStack":["bastionSecurityGroup"],"subnetStack":"BastionSubnet","tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}],"add":true,"attached":false}],"tags":[{"Key":"tenant","Value":"suzuki"},{"Key":"landscape","Value":"suzuki"}],"add":true,"attached":false}
};
const region = require("../conf/Region");

const converter = require("./ToCloudFormation");
const command   = require("../operation/cloudFormation/CreateStackCommand")
const ret = converter.convert(requestQue.vpc);
console.log(JSON.stringify(ret));

const stackName = "sunao-test";
command.prepare({region: region.name},stackName,JSON.stringify(ret),true);


