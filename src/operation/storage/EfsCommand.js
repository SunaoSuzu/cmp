const AWS = require('aws-sdk');


exports.prepare = function (config,efs,subnetIds,dnsId) {
    const client = new AWS.EFS(config);
    const dns = new AWS.Route53(config);

    return client.createFileSystem({
        ...efs.launch,
        Tags : efs.tags.concat({Key: "Name", Value: efs.name}),
    }).promise().then(function (result) {
        const fid = result.FileSystemId;
        efs["FileSystemId"]=fid;
        console.log();
        return dns.changeResourceRecordSets({
            ChangeBatch: {
                Changes: [
                    {
                        Action: "CREATE",
                        ResourceRecordSet: {
                            Name: efs.internalDomain,
                            ResourceRecords: [
                                {
                                    Value: efs["FileSystemId"] + ".efs.ap-northeast-1.amazonaws.com"
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
    })
}
