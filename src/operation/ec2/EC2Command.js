
/*
* EC2を作成する　Promiseを返却する
* */
exports.createEC2Command = function (client,ec,subnetId,sgids) {
    if(subnetId===undefined){
        console.log("80-" + ec.name + " SubNet is EMPTY");
    }
    if(sgids.length===0){
        console.log("80-" + ec.name + " Sgs is EMPTY");
    }
    let userDataEncoded = null;
    if(ec.UserData!=null){
        userDataEncoded = Buffer.from(ec.UserData, 'base64').toString();
    }
    const ids = [];

    return Promise.resolve(function () {
        console.log("80-" + ec.name + ".EC2");
    }).then(function () {
        console.log("81-" + ec.name + ".EC2");
        return client.runInstances({
            ImageId: ec.ImageId,
            InstanceType: ec.InstanceType,
            KeyName: ec.KeyName,
            MinCount: 1,
            MaxCount: 1,
            SecurityGroupIds: sgids,
            SubnetId: subnetId,
            UserData: userDataEncoded,
        }).promise();
    }).then(function (instanceRet) {
        console.log("82-" + ec.name + ".EC2.instanceExists");
        ec.InstanceIds=[];
        instanceRet.Instances.forEach(function (instance , index) {
            ec.InstanceId=instance.InstanceId;
            ec.InstanceIds[index]=instance.InstanceId;
            ec.PrivateIpAddress=instance.PrivateIpAddress;
            ec.PublicIpAddress=instance.PublicIpAddress;
            ec.SubnetId=instance.SubnetId;
            ec.VpcId=instance.VpcId;
            ec.VpcId=instance.Placement.AvailabilityZone;
            ec.attached=true;
            ids.push(ec.InstanceId);
        })
        return client.waitFor('instanceExists', {InstanceIds:ids}).promise();
    }).then(function (instanceRet) {
        console.log("83-" + ec.name + ".EC2.Tags");
        return client.createTags({
            Resources: ids,
            Tags: [
                {Key: "Name", Value: ec.name},
                {Key: "tenant", Value: "suzuki"},
                {Key: "landscape", Value: "suzuki"}
            ]
        }).promise();
    }).then(function (instanceRet) {
        console.log("85-" + ec.name + ".EC2.instanceRunning");
        return client.waitFor('instanceRunning', {InstanceIds:ids}).promise();
    }).then(function (instanceRet) {
        console.log("85-" + ec.name + ".EC2.instanceStatusOk");
        return client.waitFor('instanceStatusOk', {InstanceIds:ids}).promise();
    }).then(function (instanceRet) {
        console.log("85-" + ec.name + ".EC2.systemStatusOk");
        return client.waitFor('systemStatusOk', {InstanceIds:ids}).promise();
    })
}

