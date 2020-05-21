


/*
* EC2を作成する　Promiseを返却する
* */
exports.createEC2Command = function (que,ec,client) {
    console.log(que);
    console.log(ec);

    let subnetId = "";
    que.vpc.subnets.forEach(function (subnet) {
        if(subnet.subnetName==ec.SubnetName){
            subnetId=subnet.SubnetId;
        }
    })
    let sgids = [];
    ec.SecurityGroupNames.forEach(function (name) {
        que.vpc.securityGroups.forEach(function (sg) {
            if(name==sg.GroupName){
                sgids.push(sg.GroupId)
            }
        })
    })
    let userDataEncoded = null;
    if(ec.UserData!=null){
        userDataEncoded = Buffer.from(ec.UserData, 'base64').toString();
    }

    return Promise.resolve(function () {
        console.log("80-" + index + ".EC2");
    }).then(function () {
        console.log("81-" + index + ".EC2");
        return client.runInstances({
            ImageId: ec.ImageId,
            InstanceType: ec.InstanceType,
            KeyName: ec.KeyName,
            MinCount: 1,
            MaxCount: 1,
            SecurityGroupIds: sgids,
            SubnetId: subnetId,
            UserData: ec.userDataEncoded,
        }).promise();
    }).then(function (instanceRet) {
        console.log("82-" + index + ".EC2.Tags");
        const ids = [];
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
        return client.createTags({
            Resources: ids,
            Tags: [
                {Key: "Name", Value: ec.name},
                {Key: "tenant", Value: "suzuki"},
                {Key: "landscape", Value: "suzuki"}
            ]
        }).promise();
    }
}