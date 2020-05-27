const AWS = require('aws-sdk');
const region = require("../../conf/Region");

const cloudFormation = new AWS.CloudFormation({region: region.name});
cloudFormation.describeStackResources({StackName: "suzu-vpc"}).promise().
then(function (result) {
    const ret = result.StackResources.reduce( (arg , resource) => {
        arg[resource.LogicalResourceId]=resource;
        return arg;
    },{})
    return ret;
});
