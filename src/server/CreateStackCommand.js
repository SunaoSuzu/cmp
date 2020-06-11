const AWS = require('aws-sdk');

exports.prepare = function (config,name,body,deleteIfExist) {
    console.log("commandStart2");
    const cloudFormation = new AWS.CloudFormation(config);
    let exist = false;

    console.log("before describe");
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
            OnFailure: "DO_NOTHING",
        }).promise();
    }).then(function (result) {
        return cloudFormation.describeStacks({StackName: name}).promise();
    }).then(function (result) {
        return result.Stacks[0];
    })

}

exports.changeSet = function (config,name,setName , body) {
    console.log("config=" + JSON.stringify(config));
    console.log("name=" + name);

    const cloudFormation = new AWS.CloudFormation(config);
    try{

        console.log("createChangeSet=" + name);
        return cloudFormation.createChangeSet({
            StackName: name,
            ChangeSetName : setName,
            TemplateBody : body,
            ChangeSetType: "UPDATE",
        }).promise().then(function (result) {
            return result;
        }).catch(function (e) {
            console.log(e)
        })
    }catch (e) {
        console.log(e);
    }
}

exports.execChangeSet = function (config,name,setName ) {
    console.log("config=" + JSON.stringify(config));
    console.log("name=" + name);

    const cloudFormation = new AWS.CloudFormation(config);
    try{

        console.log("execChangeSet=" + name);
        return cloudFormation.executeChangeSet({
            StackName: name,
            ChangeSetName : setName,
        }).promise().then(function (result) {
            return result;
        }).catch(function (e) {
            console.log(e)
        })
    }catch (e) {
        console.log(e);
    }
}


exports.watchExecChangeSet = function (config,name,setName) {
    const cloudFormation = new AWS.CloudFormation(config);
    try{

        console.log("watchExecChangeSet=" + name);
        return cloudFormation.waitFor(
            "stackUpdateComplete" ,
            {StackName: name}
        ).promise().catch(/* 既に終わってる */).then(function (result) {
            console.log("describeChangeSet=" + name);
            return cloudFormation.describeStacks({StackName: name}).promise();
        }).then(function (result) {
            return result;
        }).catch(function (e) {
            console.log(e)
        })
    }catch (e) {
        console.log(e);
    }
}

exports.watchChangeSet = function (config,name,setName) {
    const cloudFormation = new AWS.CloudFormation(config);
    try{

        console.log("watchChangeSet=" + name);
        return cloudFormation.waitFor(
            "changeSetCreateComplete" ,
            {StackName: name,ChangeSetName: setName}
        ).promise().catch(/* 既に終わってる */).then(function (result) {
            console.log("describeChangeSet=" + name);
            return cloudFormation.describeChangeSet({StackName: name,ChangeSetName: setName}).promise();
        }).then(function (result) {
            return result;
        }).catch(function (e) {
            console.log(e)
        })
    }catch (e) {
        console.log(e);
    }
}


exports.watch = function (config,name) {
    console.log("config=" + JSON.stringify(config));
    console.log("name=" + name);

    const cloudFormation = new AWS.CloudFormation(config);
    console.log("commandStartWatch");
    try{

        return cloudFormation.waitFor("stackCreateComplete" , {StackName: name}).promise()
            .then(function (result) {
                console.log("describeStackResource");
                return cloudFormation.describeStackResources({StackName: name}).promise()
            }).then(function (result) {
                console.log("finish describeStackResource ");
                const ret = result.StackResources.reduce( (arg , resource) => {
                    arg[resource.LogicalResourceId]=resource;
                    return arg;
                },{})
                return ret;
            }).catch(function (e) {
                console.log(e)
            })
    }catch (e) {
        console.log(e);
    }


}