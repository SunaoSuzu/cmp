const AWS = require('aws-sdk');

exports.prepare = function (config,name,body,deleteIfExist) {
    const cloudFormation = new AWS.CloudFormation(config);
    let exist = false;

    return cloudFormation.describeStacks({StackName: name}).promise().
    then(function (result) {
        console.log("describe");
        if(result!=null&&result.Stacks.length>0){
            exist=true
        }
        return Promise.resolve(function () {
            console.log(exist);
        });
    }).catch(function(){/*例外無視*/}).then(function (result) {
        if(exist){
            console.log("delete");
            return cloudFormation.deleteStack({StackName: name}).promise()
        }
    }).then(function (result) {
        if(exist){
            console.log("wait");
            return cloudFormation.waitFor("stackDeleteComplete" , {StackName: name}).promise()
        }
    }).then(function (result) {
        console.log("create");
        return cloudFormation.createStack({
            StackName: name,
            TemplateBody : body,
        }).promise();
    }).then(function (result) {
        console.log("wait for create");
        return cloudFormation.waitFor("stackCreateComplete" , {StackName: name}).promise()
    }).then(function (result) {
        return Promise.resolve(function (result) {
            console.log("complete");
        });
    })


}
