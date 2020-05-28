//1. 0.0.0.0/0からhttpが来ることを許可する(internet facing な lb配下のprivate apもこれで良い？)
//2. 外からSSH可能（bastion）
//3. bastionからssh可能（２を参照する？）
//

export const ApIngressPattern = {
    both : [
        {
            IpProtocol: "TCP",
            FromPort: 80,
            ToPort: 80,
            CidrIp: "0.0.0.0/0",
        },
        {
            IpProtocol: "TCP",
            FromPort: 443,
            ToPort: 443,
            CidrIp: "0.0.0.0/0",
        },
    ],

    http : [
        {
            IpProtocol: "TCP",
            FromPort: 80,
            ToPort: 80,
            CidrIp: "0.0.0.0/0",
        },
    ],
    https : [
        {
            IpProtocol: "TCP",
            FromPort: 443,
            ToPort: 443,
            CidrIp: "0.0.0.0/0",
        },
    ],
    8080 : [
        {
            IpProtocol: "TCP",
            FromPort: 443,
            ToPort: 443,
            CidrIp: "0.0.0.0/0",
        },
    ],
    3000 : [
        {
            IpProtocol: "TCP",
            FromPort: 443,
            ToPort: 443,
            CidrIp: "0.0.0.0/0",
        },
    ]
}