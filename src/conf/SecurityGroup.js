//1. 0.0.0.0/0からhttpが来ることを許可する(internet facing な lb配下のprivate apもこれで良い？)
//2. 外からSSH可能（bastion）
//3. bastionからssh可能（２を参照する？）
//

const gruop =    {
        GroupName:"sunao",
        Description : "sunao",
        ingress : [
            {
                IpProtocol: "TCP",
                FromPort: 22,
                ToPort: 22,
                CidrIp: "118.240.151.69/32",
            },
            {
                IpProtocol: "TCP",
                FromPort: 22,
                ToPort: 22,
                CidrIp: "153.246.130.192/32",
            },
            {
                IpProtocol: "HTTP",
                FromPort: 80,
                ToPort: 80,
                CidrIp: "0.0.0.0/0",
            },
            {
                toMyGroup : true,
                IpProtocol: "TCP",
                FromPort: 22,
                ToPort: 22,
            },
        ]
    },
