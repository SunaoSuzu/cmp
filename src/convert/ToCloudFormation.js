/**
 * ResourcesをCloudFormationのJSONへ変換
 * */
const network = require('./VpcAndSubnetConverter');
const sg = require('./SecurityGroupsConverter');
const domain = require("../conf/Domain")


exports.convert = function (vpc) {
    let resources = network.convert(vpc);
    resources = Object.assign(resources , sg.convert(vpc));

    vpc.bastions.map(function (bastion, index) {
        resources[bastion.stack]={
            "Type" : "AWS::EC2::Instance",
            "Properties" : {
                ...bastion.launch,
                "SecurityGroupIds": bastion.securityGroupStack.map( stack => ({ "Ref" : stack})),
                "SubnetId": {"Ref": bastion.subnetStack},
                "Tags" : bastion.tags.concat({Key: "Name", Value: bastion.name}),
                "UserData" : {"Fn::Base64": "ls -l"},
            }

        }
    })
    resources[vpc.lb.stack]={
        "Type": "AWS::ElasticLoadBalancingV2::LoadBalancer",
        "Properties": {
            "Scheme": "internet-facing",
            "Subnets": vpc.lb.subnetStacks.map( stack => ({ "Ref":stack })),
            "LoadBalancerAttributes": [
                {"Key": "idle_timeout.timeout_seconds", "Value": "3600"},
                {"Key": "access_logs.s3.enabled", "Value": "true"},
                {"Key": "access_logs.s3.bucket", "Value": "logs.test.sutech" },
                {"Key": "access_logs.s3.prefix", "Value": "elb/" + vpc.lb.name }
            ],
            "SecurityGroups": vpc.lb.securityGroupStack.map( stack => ({ "Ref":stack })),
            "Name": vpc.lb.name, //TODO BG
        }
    }
    resources[vpc.lb.stack + "Listener"]={
        "Type": "AWS::ElasticLoadBalancingV2::Listener",
        "Properties": {
            "Certificates": [{"CertificateArn": domain.default.certificateArn }],
            "DefaultActions": [
                {
                    "Type": "fixed-response",
                    "FixedResponseConfig": {
                        "ContentType": "text/plain",
                        "MessageBody": "Page Not Found",
                        "StatusCode": "404"
                    }
                }
            ],
            "LoadBalancerArn": {
                "Ref": vpc.lb.stack
            },
            "Port": 443,
            "Protocol": "HTTPS",
            "SslPolicy": "ELBSecurityPolicy-TLS-1-2-2017-01"
        }

    }
    vpc.apps.map( app => {
        resources[app.ap.stack + "Launch"]={
            "Type": "AWS::AutoScaling::LaunchConfiguration",
            "Properties": {
                ...app.ap.launch,
                "InstanceMonitoring" :app.ap.InstanceMonitoring,
                "SecurityGroups": app.ap.securityGroupStack.map( stack => ({ "Ref" : stack})),
                "UserData": {"Fn::Base64":"ls -l"}
            }
        }
        resources[app.ap.stack + "Auto"]={
            "Type": "AWS::AutoScaling::AutoScalingGroup",
            "Properties": {
                "LaunchConfigurationName": {"Ref": app.ap.stack + "Launch"},
                "MinSize": 1,
                "MaxSize": 1,
                "TargetGroupARNs": [{"Ref": app.ap.stack + "TargetGroup"}],
                "MetricsCollection": [{
                    "Granularity": "1Minute",
                    "Metrics": ["GroupMinSize", "GroupMaxSize"]
                }],
                "VPCZoneIdentifier": app.ap.subnetsStack.map( stack => ({ "Ref":stack })),
                "Tags": app.ap.tags.map( t =>  ({...t ,PropagateAtLaunch : true }) )
                    .concat({PropagateAtLaunch : true , Key : "Name" , Value : app.ap.name})
            },
            "UpdatePolicy": {
                "AutoScalingRollingUpdate": {
                    "MaxBatchSize": 1,
                    "MinInstancesInService": 0,
                    "PauseTime": "PT15M",
                    "SuspendProcesses": [
                        "AlarmNotification"
                    ],
                    "WaitOnResourceSignals": true
                }
            }
        }
        resources[app.ap.stack + "TargetGroup"]={
            "Type": "AWS::ElasticLoadBalancingV2::TargetGroup",
            "Properties": {
                "HealthCheckIntervalSeconds": 30,
                "HealthCheckTimeoutSeconds": 29,
                "UnhealthyThresholdCount": 2,
                "HealthyThresholdCount": 2,
                "HealthCheckPath": app.ap.healthCheckUrl,
                "HealthCheckProtocol": "HTTP",
                "HealthCheckPort": "80",
                "Matcher": {
                    "HttpCode": "200"
                },
                "Name": app.ap.name + "-targetGroup",
                "Port": 80,
                "Protocol": "HTTP",
                "TargetType": "instance",
                "TargetGroupAttributes": [
                    {"Key": "stickiness.enabled", "Value": "true"},
                    {"Key": "stickiness.lb_cookie.duration_seconds", "Value": "1800"}
                ],
                "VpcId": {
                    "Ref": vpc.stack
                }
            }
        }
        resources[app.ap.stack + "ListerRule"]={
            "Type": "AWS::ElasticLoadBalancingV2::ListenerRule",
            "Properties": {"Actions": [
                    {
                        "Type": "forward",
                        "TargetGroupArn": {"Ref": app.ap.stack + "TargetGroup"}
                    }
                ],
                "Conditions": [
                    {
                        "Field": "host-header",
                        "Values": [{"Fn::GetAtt": [vpc.lb.stack, "DNSName"]},app.ap.domain , app.ap.internalDomain]
                    }
                ],
                "ListenerArn": {"Ref": vpc.lb.stack + "Listener"},
                "Priority": 10
            }

        }
        resources[app.db.stack]={
            "Type" : "AWS::EC2::Instance",
            "Properties" : {
                ...app.db.launch,
                "SecurityGroupIds": app.db.securityGroupStack.map( stack => ({ "Ref" : stack})),
                "SubnetId": {"Ref": app.db.subnetStack},
                "Tags" : app.db.tags.concat({Key: "Name", Value: app.db.name}),
                "UserData" : {"Fn::Base64": "ls -l"},
            }
        }
        resources[app.db.stack + "PrivateDNS"]={
            "Type" : "AWS::Route53::RecordSet",
            "Properties" : {
                "HostedZoneName" : vpc.hostedZone + ".",
                "Comment" : "DNS name for DB",
                "Name" : app.db.internalDomain,
                "Type" : "CNAME",
                "TTL" : "300",
                "ResourceRecords" : [
                    { "Fn::GetAtt" : [ app.db.stack, "PrivateDnsName" ] }
                ]
            }
        }
        resources[app.bs.stack]={
            "Type" : "AWS::EC2::Instance",
            "Properties" : {
                ...app.bs.launch,
                "SecurityGroupIds": app.bs.securityGroupStack.map( stack => ({ "Ref" : stack})),
                "SubnetId": {"Ref": app.bs.subnetStack},
                "Tags" : app.bs.tags.concat({Key: "Name", Value: app.bs.name}),
                "UserData" : {"Fn::Base64": "ls -l"},
            }
        }
        resources[app.bs.stack + "PrivateDNS"]={
            "Type" : "AWS::Route53::RecordSet",
            "Properties" : {
                "HostedZoneName" : vpc.hostedZone + ".",
                "Comment" : "DNS name for DB",
                "Name" : app.bs.internalDomain,
                "Type" : "CNAME",
                "TTL" : "300",
                "ResourceRecords" : [
                    { "Fn::GetAtt" : [ app.bs.stack, "PrivateDnsName" ] }
                ]
            }
        }



        resources[app.ap.stack + "PublicDNS"]={
            "Type" : "AWS::Route53::RecordSet",
            "Properties" : {
                "HostedZoneName" : domain.default.url + ".",
                "Comment" : "DNS name for ALB",
                "Name" : app.ap.domain,
                "Type" : "CNAME",
                "TTL" : "300",
                "ResourceRecords" : [
                    { "Fn::GetAtt" : [ vpc.lb.stack, "DNSName" ] }
                ]
            }
        }
    })

    const ret = {
        "AWSTemplateFormatVersion": "2010-09-09",
        "Description": "Sunao Test name=" + vpc.name,
        Resources : resources
    };

    return ret;
}