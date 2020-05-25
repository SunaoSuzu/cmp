const AWS = require('aws-sdk');

/*
* EC2を作成する　Promiseを返却する
* */
exports.prepare = function (client,config , ec,subnetId,sgids,dnsId) {
    const dns = new AWS.Route53(config);

    if(subnetId===undefined){
        console.log("80-" + ec.name + " SubNet is EMPTY");
    }
    if(sgids.length===0){
        console.log("80-" + ec.name + " Sgs is EMPTY");
    }
    console.log("sgids=" + JSON.stringify(sgids));
    console.log("subnetId=" + subnetId);
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
            ...ec.launch ,
            MinCount: 1,
            MaxCount: 1,
            SecurityGroupIds: sgids,
            SubnetId: subnetId,
            UserData: userDataEncoded,
        }).promise();
    }).then(function (instanceRet) {
        console.log("82-" + ec.name + ".EC2.instanceExists");
        const instance = instanceRet.Instances[0];
        ids[0]=instance.InstanceId;
        ec.InstanceId=instance.InstanceId;
        ec.PrivateIpAddress=instance.PrivateIpAddress;
        ec.PublicIpAddress=instance.PublicIpAddress;
        ec.SubnetId=instance.SubnetId;
        ec.VpcId=instance.VpcId;
        ec.AvailabilityZone=instance.Placement.AvailabilityZone;
        ec.PrivateDnsName=instance.PrivateDnsName;
        ec.attached=true;
        return client.waitFor('instanceExists', {InstanceIds:ids}).promise();
    }).then(function (instanceRet) {
        console.log("83-" + ec.name + ".EC2.Tags");
        return client.createTags({
            Resources: ids,
            Tags: ec.tags.concat({Key: "Name", Value: ec.name}),
        }).promise();
    }).then(function (instanceRet) {
        return dns.changeResourceRecordSets({
            ChangeBatch: {
                Changes: [
                    {
                        Action: "CREATE",
                        ResourceRecordSet: {
                            Name: ec.internalDomain,
                            ResourceRecords: [
                                {
                                    Value: ec.PrivateDnsName
                                }
                            ],
                            TTL: 60,
                            Type: "CNAME"
                        }
                    }
                ],
                Comment: "internal"
            },
            HostedZoneId: dnsId
        }).promise();
    });
}

