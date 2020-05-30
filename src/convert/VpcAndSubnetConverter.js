const region = require("../conf/Region")
exports.convert = function (vpc) {
    const resources = {};
    resources[vpc.stack] = {
        "Type": "AWS::EC2::VPC",
        "Properties": {
            "EnableDnsSupport": true,
            "EnableDnsHostnames": true,
            "CidrBlock": vpc.cidr,
            "Tags": vpc.tags.concat({Key: "Name", Value: vpc.name}),
        }
    };
    resources[vpc.igw.stack] = {
        "Type": "AWS::EC2::InternetGateway",
        "Properties": {
            "Tags": vpc.tags.concat({Key: "Name", Value: vpc.igw.name}),
        }

    };
    resources[vpc.igw.stack + "Attach"] = {
        "Type": "AWS::EC2::VPCGatewayAttachment",
        "Properties": {
            "VpcId": {"Ref": vpc.stack},
            "InternetGatewayId": {"Ref": vpc.igw.stack}
        }
    };
    resources["publicRouteTable"] = {
        "Type": "AWS::EC2::RouteTable",
        "Properties": {
            "VpcId": {"Ref": vpc.stack},
            "Tags": vpc.tags.concat({Key: "Name", Value: vpc.igw.name}),
        }
    }

    resources["PublicRoute"] = {
        "Type": "AWS::EC2::Route",
        "Properties": {
            "RouteTableId": {"Ref": "publicRouteTable"},
            "DestinationCidrBlock": "0.0.0.0/0",
            "GatewayId": {"Ref": vpc.igw.stack}
        }
    }
    vpc.subnets.forEach(function (subnet,index) {
        resources[subnet.stack] = {
            "Type": "AWS::EC2::Subnet",
            "Properties": {
                "AvailabilityZone": subnet.AvailabilityZone,
                "CidrBlock": subnet.cidr,
                "MapPublicIpOnLaunch": subnet.attachIgw,
                "VpcId": {
                    "Ref": vpc.stack
                },
                "Tags": subnet.tags.concat({Key: "Name", Value: subnet.subnetName}),
            }
        };
        if(subnet.attachIgw){
            resources[subnet.stack + "RouteTableAssociation"]={
                "Type": "AWS::EC2::SubnetRouteTableAssociation",
                "Properties": {
                    "SubnetId": {
                        "Ref": subnet.stack
                    },
                    "RouteTableId": {
                        "Ref": "publicRouteTable"
                    }
                }
            }
            if(vpc.nat){
                resources[subnet.stack + "NatEip"]={
                    "Type": "AWS::EC2::EIP",
                    "Properties": {
                        "Domain": {"Ref": vpc.stack},
                        "Tags": subnet.tags.concat({Key: "Name", Value: subnet.subnetName + "NatEip"}),
                    }
                }
                resources[subnet.stack + "Nat"]={
                    "Type": "AWS::EC2::NatGateway",
                    "Properties": {
                        "AllocationId": {"Fn::GetAtt": [subnet.stack + "NatEip", "AllocationId"]},
                        "SubnetId": {"Ref": subnet.stack},
                        "Tags": subnet.tags.concat({Key: "Name", Value: subnet.subnetName + "Nat"}),
                    }
                }
            }
        }else{
            if(vpc.nat){
                resources[subnet.stack + "RouteTable"]={
                    "Type": "AWS::EC2::RouteTable",
                    "Properties": {"VpcId": {"Ref": vpc.stack},
                        "Tags": subnet.tags.concat({Key: "Name", Value: subnet.subnetName + "RouteTable"}),
                    }
                }
                resources[subnet.stack + "Route"]={
                    "Type": "AWS::EC2::Route",
                    "Properties": {
                        "RouteTableId": {"Ref": subnet.stack + "RouteTable"},
                        "DestinationCidrBlock": "0.0.0.0/0",
                        "NatGatewayId": {"Ref": subnet.publicSubnetStack + "Nat"}
                    }
                }
                resources[subnet.stack + "RouteTableAssociation"]={
                    "Type": "AWS::EC2::SubnetRouteTableAssociation",
                    "Properties": {
                        "SubnetId": {"Ref": subnet.stack},
                        "RouteTableId": {"Ref": subnet.stack + "RouteTable"}
                    }
                }
            }
        }
    })
    resources[vpc.stack + "InternalDns"] = {
        "Type": "AWS::Route53::HostedZone",
        "Properties": {
            "HostedZoneConfig": {"Comment": "internal dns for " + vpc.name},
            "Name": vpc.hostedZone,
            "VPCs": [
                {
                    "VPCId": {
                        "Ref": vpc.stack
                    },
                    "VPCRegion": region.name
                }
            ]
        }
    }
    return resources;
}