/**
 * AutoScaling
 * 1.AWS::AutoScaling::LaunchConfiguration
 * 2.AWS::AutoScaling::AutoScalingGroup
 * */
const AWS = require('aws-sdk');


exports.prepare = function (config ,ap , subnets , sgids) {

    const autoscaling = new AWS.AutoScaling(config);
    let userDataEncoded = null;
    if(ap.launch.UserData!=null){
        userDataEncoded = Buffer.from(ap.launch.UserData, 'base64').toString();
    }

    const suffix = Math.round( Math.random()*1000 );    //TODO 消す
    const launchName = ap.name + "_auto_launch" + suffix;
    const groupName  = ap.name + "_auto_group" + suffix;

    const vpcZoneIdentifier = Object.values(subnets).join(',');

    const launchTags = ap.tags.map( t =>  ({...t ,PropagateAtLaunch : true }) )
        .concat({PropagateAtLaunch : true , Key : "Name" , Value : ap.name});

    console.log("AutoScaling.createLaunchConfiguration");

    return autoscaling.createLaunchConfiguration({
        ...ap.launch,
        InstanceMonitoring: {"Enabled":ap.InstanceMonitoring},
        UserData:userDataEncoded,
        SecurityGroups : sgids,
        LaunchConfigurationName : launchName,
    }).promise().then(function (result) {
        console.log("AutoScaling.createAutoScalingGroup");
        return autoscaling.createAutoScalingGroup({
            AutoScalingGroupName: groupName,
            LaunchConfigurationName: launchName,
            TargetGroupARNs : [ap["targetGroupArn"]],
            MinSize: ap.min,
            MaxSize: ap.max,
            VPCZoneIdentifier:vpcZoneIdentifier,
            Tags : launchTags,
        }).promise();
    }).then(function (result) {
        console.log("AutoScaling.enableMetricsCollection");
        return autoscaling.enableMetricsCollection({
            AutoScalingGroupName: groupName,
            Granularity: "1Minute",
            Metrics : ["GroupMinSize","GroupMaxSize"],
        }).promise();
    })
}
