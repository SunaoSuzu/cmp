
/**
 * とりあえずRyoさん作のプログラムで色々やってみる
 * APのURL
 * {subDomain}{suffix}{rootDomain}
 * ex.suzu001-app0.sutech.co.jp
 * 各internalDomain
 * {sn}.{subDomain}.{rootDomain}
 * app0.suzu001.sutech.internal
 **/
const products = {
    99 : {
        suffix  : "-spring",
        ap : {
            canDistribute     : true  ,   //特にまだ使われてない
            isStateless       : false ,   //特にまだ使われてない
            canDocker         : true  ,   //特にまだ使われてない
            healthCheckUrl    : "/currentversion",
            sn                : "spring-ap",
            stack             : "RyoSpringAp",
            launch : {
                ImageId      : "ami-08cb2a57735400567",
                InstanceType : "t2.micro",
                KeyName      : "sunao",
                UserData     : "#!/bin/bash\n" +
                    "cd /var/tmp/\n" +
                    "bash start.sh\n",
            },
            InstanceMonitoring: "false"
        },
        db : {
            sn            : "spring-db",
            stack             : "RyoSpringDb",
            launch: {
                ImageId      : "ami-03e4521d84f084007",
                InstanceType : "t2.micro",
                KeyName      : "sunao",
                UserData     : "ls -l",
                BlockDeviceMappings : [
                    {DeviceName: "/dev/sdg" , Ebs:{VolumeSize:"1" , VolumeType: "gp2"}},
                ],
            },
        },
        bs : {
            sn            : "spring-bs",
            stack             : "RyoSpringBs",
            launch: {
                ImageId      : "ami-03e4521d84f084007",
                InstanceType : "t2.micro",
                UserData     : "ls -l",
                KeyName      : "sunao",
            },
        },
        ss : {
            sn            : "spring-ss",
            stack             : "RyoSpringSS",
            launch: {
                ImageId      : "ami-03e4521d84f084007",
                InstanceType : "t2.micro",
                UserData     : "ls -l",
                KeyName      : "sunao",
            },
        },
        efs : {
            stack             : "RyoSpringEFS",
            sn            : "spring-efs",
            launch: {
                PerformanceMode      : "generalPurpose",
                Encrypted : "true",
            },
        },
    }
}
function getById(id){
    return products[id];
}
module.exports = getById;