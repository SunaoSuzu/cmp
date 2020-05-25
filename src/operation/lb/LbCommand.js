
exports.lbPrepare = function (client,lb,subnetIds,sgIds,ec2Ids) {
    const instances = [];
    ec2Ids.map(function(id){
        instances.push({InstanceId : id})
    })

    return client.createLoadBalancer({
        Listeners: [
            {
                InstancePort: 80,
                InstanceProtocol: "HTTP",
                LoadBalancerPort: 80,
                Protocol: "HTTP"
            }
        ],
        SecurityGroups: sgIds ,
        LoadBalancerName: lb.name,
        Subnets: subnetIds,
        Tags: [
            {Key: "Name", Value: lb.name},
            {Key: "tenant", Value: "suzuki"},
            {Key: "landscape", Value: "suzuki"}
        ]

    }).promise().then(function (ret){
        lb.DNSName = ret.DNSName;
        return client.configureHealthCheck({
            HealthCheck: {
                HealthyThreshold: 2,
                Interval: 30,
                Target: "HTTP:80/index.html",
                Timeout: 3,
                UnhealthyThreshold: 2
            },
            LoadBalancerName: lb.name,
        }).promise();
    }).then(function (){
        return client.registerInstancesWithLoadBalancer({
            Instances: instances,
            LoadBalancerName: lb.name
        }).promise();
    }).then(function (){
        return client.waitFor('instanceInService',{
            Instances: instances,
            LoadBalancerName: lb.name
        }).promise();
    })
}