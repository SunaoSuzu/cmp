
exports.prepare = function (client,vpc) {
    console.log("1.VPC作成");
    return client.createVpc({
        CidrBlock: vpc.cidr,
        AmazonProvidedIpv6CidrBlock: false,
        DryRun: false,
        InstanceTenancy: "default"
    }).promise().then(function (vpcDataRet) {
        console.log("1.VPC.EXIST");
        vpc.VpcId=vpcDataRet.Vpc.VpcId;
        vpc.attached=true;
        return client.waitFor('vpcExists', {VpcIds:[vpc.VpcId]}).promise();
    }).then(function (vpcDataRet) {
        console.log("1.VPC.TAG");
        return client.createTags({
            Resources: [vpc.VpcId],
            Tags: [
                {Key: "Name", Value: vpc.name},
                {Key: "tenant", Value: "suzuki"},
                {Key: "landscape", Value: "suzuki"}
            ]
        }).promise();
    }).then(function (result) {
        console.log("2.InternetGateWay");
        return client.createInternetGateway().promise();
    }).then(function (internetGatewayRet) {
        console.log("3.InternetGateWay.Tags");
        vpc.igw.InternetGatewayId=internetGatewayRet.InternetGateway.InternetGatewayId;
        vpc.igw.attached=true;
        return client.createTags({
            Resources: [vpc.igw.InternetGatewayId],
            Tags: [
                {Key: "Name", Value: vpc.igw.name},
                {Key: "tenant", Value: "suzuki"},
                {Key: "landscape", Value: "suzuki"}
            ]
        }).promise();
    }).then(function () {
        console.log("4.VPC <-> InternetGateWay");
        return client.attachInternetGateway({
            VpcId: vpc.VpcId,
            InternetGatewayId: vpc.igw.InternetGatewayId,
        }).promise();
    }).then(function (result) {
        console.log("5.RouteTable");
        return client.createRouteTable({
            VpcId: vpc.VpcId,
        }).promise();
    }).then(function (routeDataRet) {
        console.log("6.RouteTable.Tags");
        vpc.RouteTableId=routeDataRet.RouteTable.RouteTableId;
        vpc.RouteTableAttached=true;
        return client.createTags({
            Resources: [vpc.RouteTableId],
            Tags: [
                {Key: "Name", Value: vpc.name},
                {Key: "tenant", Value: "suzuki"},
                {Key: "landscape", Value: "suzuki"}
            ]
        }).promise();
    }).then(function () {
        console.log("7.Route:DefaultGateway");
        return client.createRoute({
            RouteTableId: vpc.RouteTableId,
            DestinationCidrBlock: vpc.igw.defaultGateWay,
            GatewayId: vpc.igw.InternetGatewayId,
        }).promise();
    })

}
