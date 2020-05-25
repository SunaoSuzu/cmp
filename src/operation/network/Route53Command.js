
const AWS = require('aws-sdk');


exports.addPublic = function (config,lb,domain) {
    const dns = new AWS.Route53(config);
    return dns.changeResourceRecordSets({
        ChangeBatch: {
            Changes: [
                {
                    Action: "UPSERT",
                    ResourceRecordSet: {
                        AliasTarget: {
                            DNSName: lb["dns"],
                            EvaluateTargetHealth: false,
                            HostedZoneId: lb["CanonicalHostedZoneId"]
                        },
                        Name: domain,
                        Type: "A"
                    }
                }
            ],
            Comment: "app server app0 of suzu01"
        },
        HostedZoneId: "Z039134724ASSPZ8K18CW"// Depends on the type of resource that you want to route traffic to
    }).promise();
}
