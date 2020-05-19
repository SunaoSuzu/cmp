//作業を割り出す
import getConfiguration from "../Configuration";
import {pattern} from "../conf/EnvirornmentPattern";

//後でどこかに移すだろう
const CREATE_VPC = "CREATE_VPC";
const CREATE_EC2 = "CREATE_EC2";

//Operationsは多分不要
function OperationTemplateMaker(tenant, environment) {
  const conf = getConfiguration();
  let resources = [];
  let operations = [];

  //共通タグ（参照渡しになってるからコピーしないとマズイ予感）
  const tagUsage = conf.tagUsage;
  const tenantTag = tagUsage.tenant;
  const envTag = tagUsage.environment;
  let tags = [];
  if (tagUsage) {
    if (tenantTag !== "") {
      tags.push({ name: tenantTag, value: tenant.awsTag });
    }
    if (envTag !== "") {
      tags.push({ name: envTag, value: environment.awsTag });
    }
  }

  //かなりハードコーディング
  if (environment.vpcType === 1) {
    //
    resources = {...pattern[1] , tags: tags , add: true , attached: false};

    operations.push({
      command: CREATE_VPC,
      target: resources,
    });

    //とりあえずコンポーネントを全EC2に配備
    resources.ec2s.forEach(function (ec2) {
      ec2.tags=tags;
      ec2.components=environment.mainComponents;
      ec2.add=true;
      ec2.attached=false;
      operations.push({
        command: CREATE_EC2,
        target: ec2,
      });
    })
    return { resources, operations };
  }
}
export default OperationTemplateMaker;
