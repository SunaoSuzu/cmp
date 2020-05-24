/**
 * AP向け　ALBの設定
 * */
const AWS = require('aws-sdk');

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
        console.log("alb.arn=" + arn);
        console.log("alb.loadBalancerExists");
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
            Port: 80,
            Protocol: "HTTP",
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
        console.log("alb.createTarget");
        return client.createTargetGroup({
            HealthCheckIntervalSeconds: "30",
            HealthCheckTimeoutSeconds: "29",
            UnhealthyThresholdCount: "2",
            HealthyThresholdCount: "2",
            HealthCheckPath: "/index.html",
            HealthCheckProtocol: "HTTP",
            HealthCheckPort: '80',
            Matcher:{HttpCode: '200'},
            Name: name + "-target-group",
            Port: "80",
            Protocol: "HTTP",
            TargetType: "instance",
            VpcId : vpcId,
        }).promise();
    }).then(function (result) {
        const arn = result.TargetGroups[0].TargetGroupArn;
        lb["targetGroupArn"]=arn;
        console.log("alb.modifyTargetGroupAttributes");
        return client.modifyTargetGroupAttributes({
            Attributes : [
                {Key : "stickiness.enabled", Value:"true"},
                {Key : "stickiness.lb_cookie.duration_seconds", Value:"1800"},
            ],
            TargetGroupArn : arn,
        }).promise();
    }).then(function (result) {
        console.log("alb.createRule");
        return client.createRule({
            Actions : [
                {Type : "forward", TargetGroupArn:lb["targetGroupArn"]},
            ],
            Conditions : [
                {Field : "host-header", Values: [lb["dns"]]},
            ],
            ListenerArn : lb["listenerArn"],
            Priority : 10,
        }).promise();
    })
}
