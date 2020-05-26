
/**
 * とりあえずRyoさん作のプログラムで色々やってみる
 **/
const products = {
    99 : {
        suffix  : "-app0",
        ap : {
            canDistribute     : true  ,   //APは冗長化可能か
            isStateless       : false ,   //うーーん。冗長化方法みたいなのが良いかな
            canDocker         : true  ,   //
            healthCheckUrl    : "/index.html",
            suffix            : "-app0-ap",
            launch : {
                ImageId      : "ami-03e4521d84f084007",
                InstanceType : "t2.micro",
                KeyName      : "sunao",
                InstanceMonitoring: {Enabled:false}
            },
        },
        db : {
            suffix            : "-app0-db",
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
            suffix            : "-app0-bs",
            launch: {
                ImageId      : "ami-03e4521d84f084007",
                InstanceType : "t2.micro",
                KeyName      : "sunao",
            },
        },
        ss : {
            suffix            : "-app0-ss",
            launch: {
                ImageId      : "ami-03e4521d84f084007",
                InstanceType : "t2.micro",
                KeyName      : "sunao",
            },
        },
    }
}
function getById(id){
    return products[id];
}
module.exports = getById;