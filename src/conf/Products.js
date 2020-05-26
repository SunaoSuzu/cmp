
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
        suffix  : "-app0",
        ap : {
            canDistribute     : true  ,   //APは冗長化可能か
            isStateless       : false ,   //うーーん。冗長化方法みたいなのが良いかな
            canDocker         : true  ,   //
            healthCheckUrl    : "/index.html",
            sn                : "app0-ap",
            stack             : "RyoSpringAp",
            launch : {
                ImageId      : "ami-03e4521d84f084007",
                InstanceType : "t2.micro",
                KeyName      : "sunao",
            },
            InstanceMonitoring: "false"
        },
        db : {
            sn            : "app0-db",
            stack             : "RyoSpringDb",
            launch: {
                ImageId      : "ami-03e4521d84f084007",
                InstanceType : "t2.micro",
                KeyName      : "sunao",
                BlockDeviceMappings : [
                    {DeviceName: "/dev/sdg" , Ebs:{VolumeSize:"1" , VolumeType: "gp2"}},
                ],
            },
        },
        bs : {
            sn            : "app0-bs",
            stack             : "RyoSpringBs",
            launch: {
                ImageId      : "ami-03e4521d84f084007",
                InstanceType : "t2.micro",
                KeyName      : "sunao",
            },
        },
        ss : {
            sn            : "app0-ss",
            stack             : "RyoSpringSS",
            launch: {
                ImageId      : "ami-03e4521d84f084007",
                InstanceType : "t2.micro",
                KeyName      : "sunao",
            },
        },
        efs : {
            stack             : "RyoSpringEFS",
            sn            : "efs",
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