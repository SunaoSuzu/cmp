/**
 * AutoScaling
 * 1.AWS::AutoScaling::LaunchConfiguration
 * 2.AWS::AutoScaling::AutoScalingGroup
 * */
const AWS = require('aws-sdk');


exports.prepare = function (config ,ec , subnets , sgids , lbGroupArn) {

    const autoscaling = new AWS.AutoScaling(config);
    let userDataEncoded = null;
    if(ec.UserData!=null){
        userDataEncoded = Buffer.from(ec.UserData, 'base64').toString();
    }

    const suffix = Math.round( Math.random()*1000 );    //TODO 消す
    const launchName = ec.name + "_auto_launch" + suffix;
    const groupName  = ec.name + "_auto_group" + suffix;

    const vpcZoneIdentifier = Object.values(subnets).join(',');

    const launchTags = ec.tags.map( t =>  ({...t ,PropagateAtLaunch : true }) )
        .concat({PropagateAtLaunch : true , Key : "name" , value : ec.name});

    console.log("AutoScaling.createLaunchConfiguration");

    return autoscaling.createLaunchConfiguration({
        LaunchConfigurationName : launchName,
        ImageId: ec.ImageId,
        InstanceType: ec.InstanceType,
        KeyName: ec.KeyName,
        SecurityGroups: sgids,
        UserData: userDataEncoded,
        InstanceMonitoring: {Enabled:false},
    }).promise().then(function (result) {
        console.log("AutoScaling.createAutoScalingGroup");
        return autoscaling.createAutoScalingGroup({
            AutoScalingGroupName: groupName,
            LaunchConfigurationName: launchName,
            TargetGroupARNs : [lbGroupArn],
            MinSize: 1,
            MaxSize: 1,
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
