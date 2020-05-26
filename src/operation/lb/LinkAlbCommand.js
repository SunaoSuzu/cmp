/**
 * AutoScaleとALBを紐付ける
 * */
const AWS = require('aws-sdk');

exports.link = function (config,lb,ap , vpcId) {
    const client = new AWS.ELBv2(config);
    const suffix = Math.round( Math.random()*1000 );    //TODO 消す
    const name   = ap.name + suffix;
    const healthCheckUrl = ap.healthCheckUrl;

    console.log("alb.createTargetGroup");
    return client.createTargetGroup({
        HealthCheckIntervalSeconds: "30",
        HealthCheckTimeoutSeconds: "29",
        UnhealthyThresholdCount: "2",
        HealthyThresholdCount: "2",
        HealthCheckPath: healthCheckUrl,
        HealthCheckProtocol: "HTTP",
        HealthCheckPort: '80',
        Matcher:{HttpCode: '200'},
        Name: name + "-target-group",
        Port: "80",
        Protocol: "HTTP",
        TargetType: "instance",
        VpcId : vpcId,
    }).promise().then(function (result) {
        const arn = result.TargetGroups[0].TargetGroupArn;
        ap["targetGroupArn"]=arn;
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
                {Type : "forward", TargetGroupArn:ap["targetGroupArn"]},
            ],
            Conditions : [
                {Field : "host-header", Values: [lb["dns"] , ap["domain"] , ap["internalDomain"]]},
            ],
            ListenerArn : lb["listenerArn"],
            Priority : 10,
        }).promise();
    })
}
