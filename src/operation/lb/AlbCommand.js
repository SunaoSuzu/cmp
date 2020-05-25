/**
 * AP向け　ALBの設定
 * */
const AWS = require('aws-sdk');
const domain = require("../../conf/Domain")

const HTTPS_PORT = 443;

exports.prepare = function (config,lb,subnetIds,sgIds,vpcId) {
    const client = new AWS.ELBv2(config);
    const suffix = Math.round( Math.random()*1000 );    //TODO 消す
    const name = lb.name + suffix;

    console.log("alb.start");
    return client.createLoadBalancer({
        Name: name,
        Scheme: "internet-facing",
        SecurityGroups: sgIds ,
        Subnets: subnetIds,
    }).promise().then(function (result) {
        const arn = result.LoadBalancers[0].LoadBalancerArn;
        const dns = result.LoadBalancers[0].DNSName;
        lb["arn"]=arn;
        lb["dns"]=dns;
        return client.waitFor("loadBalancerExists",{Names : [name]}).promise();
    }).then(function (result) {
        console.log("alb.modifyLoadBalancerAttributes");
        return client.modifyLoadBalancerAttributes({
            Attributes : [
                {Key : "idle_timeout.timeout_seconds", Value:"3600"},
                {Key : "access_logs.s3.enabled", Value:"true"},
                {Key : "access_logs.s3.bucket", Value:"logs.test.sutech"},
                {Key : "access_logs.s3.prefix", Value:"elb/" + name},
            ],
            LoadBalancerArn : lb.arn,
        }).promise();
    }).then(function (result) {
        console.log("alb.createListener");
        return client.createListener({
            LoadBalancerArn : lb["arn"],
            Port: HTTPS_PORT,
            Protocol: "HTTPS",
            SslPolicy : "ELBSecurityPolicy-TLS-1-2-2017-01",
            Certificates: [
                {CertificateArn: domain.default.certificateArn}
            ],
            DefaultActions: [
                {
                    Type: "fixed-response",
                    FixedResponseConfig : {
                        ContentType: "text/plain",
                        MessageBody: "Page Not Found",
                        StatusCode: "404",
                    }
                },
            ],
        }).promise();
    }).then(function (result) {
        const arn = result.Listeners[0].ListenerArn;
        lb["listenerArn"]=arn;
        return client.waitFor("loadBalancerExists",{Names : [name]}).promise();
    })
}
