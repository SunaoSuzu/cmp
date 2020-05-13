//作業を割り出す
import getConfiguration from "../Configuration";

//後でどこかに移すだろう
const CREATE_VPC = "CREATE_VPC";
const CREATE_EC2 = "CREATE_EC2";

//Operationsは多分不要
function OperationTemplateMaker(tenant , environment) {
    const conf = getConfiguration();
    let resources      = []
    let operations     = []

    //共通タグ（参照渡しになってるからコピーしないとマズイ予感）
    const tagUsage  =conf.tagUsage;
    const tenantTag = tagUsage.tenant;
    const envTag    = tagUsage.environment;
    let tags = [];
    if(tagUsage){
        if(tenantTag!==""){
            tags.push({name :tenantTag , value : tenant.awsTag});
        }
        if(envTag!==""){
            tags.push({name :envTag , value : environment.awsTag});
        }
    }

    //かなりハードコーディング
    if (environment.vpcType===1){
        //
        resources = { vpcName : "xxxx" , tags : tags  , add : true  , attached : false, ec2 :[]};
        operations.push({
            command : CREATE_VPC , target : resources
        })


        //とりあえずコンポーネント毎にEC2を作る
        environment.mainComponents.map(function (component) {
            let ec2 =  {ec2Name : "xxx" ,   instanceType : "t2.micro" ,
                tags : tags , components: [component] ,
                add:true , attached : false
            }
            resources.ec2.push(ec2);
            operations.push({
                command : CREATE_EC2 , target : ec2
            })
        })
        return {resources , operations}
    }
}
export default OperationTemplateMaker;