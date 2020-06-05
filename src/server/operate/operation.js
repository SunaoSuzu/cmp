/**
 * 冗長なのでいつかリファクタリング
 * */
const AWS = require('aws-sdk'),
    documentClient = new AWS.DynamoDB.DocumentClient({region : "ap-northeast-1"});
const util = require('util');

const prefix_latest = "latest";
const prefix_current = "current";
const prefix_log = "log";


function decideDataKeys(user,key,revision){
    return { "tenantKey" : user.mt ,
        "dataKey" : decideLatestPrefix(user, prefix_latest) + "_" + key,
        "currentKey" : decideLatestPrefix(user, prefix_current) + "_" + user.userName + "_" +  key,
        "logKey"  : decideLatestPrefix(user, prefix_log) + "_" + key + "_" + revision,
    } ; //入力者までつければ同時入力まで防げるけど。。
}

function decideSearchKeys(user){
    return { "tenantKey" : user.mt ,
        "searchKey" : decideLatestPrefix(user, prefix_latest),
        "currentKey" : decideLatestPrefix(user, prefix_current),
        "myCurrentKey" : decideLatestPrefix(user, prefix_current)+ "_" + user.userName
    } ; //入力者までつければ同時入力まで防げるけど。。
}


function decideLatestPrefix(user,prefix){
    return user.stage + "_" + user.schem + "_" +  prefix;
}


function getNowYMD(){
    const dt = new Date();
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth()+1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);

    let hh = dt.getHours();
    let mi = dt.getMinutes();
    let ss = dt.getSeconds();

    hh = ("00" + hh).slice(-2);
    mi = ("00" + mi).slice(-2);
    ss = ("00" + ss).slice(-2);

    const result = y + m + d + hh + mi + ss;
    return result;
}

exports.getCurrentList = async function getCurrentList(user){
    try {
        const searchKeys = decideSearchKeys(user);
        let result = await documentClient.query({
            TableName : 'operation',
            KeyConditionExpression: "tenant = :tenantKey and begins_with(operationKey , :operationKey) ",
            ExpressionAttributeValues: {
                ":tenantKey": searchKeys.tenantKey,
                ":operationKey": searchKeys.currentKey,
            }
        }).promise();
        return result.Items;
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}

exports.getMyCurrentList = async function getMyCurrentList(user){
    try {
        const searchKeys = decideSearchKeys(user);
        let result = await documentClient.query({
            TableName : 'operation',
            KeyConditionExpression: "tenant = :tenantKey and begins_with(operationKey , :operationKey) ",
            ExpressionAttributeValues: {
                ":tenantKey": searchKeys.tenantKey,
                ":operationKey": searchKeys.myCurrentKey,
            }
        }).promise();
        return result.Items;
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}

exports.getList = async function getList(user){
    try {
        const searchKeys = decideSearchKeys(user);
        let result = await documentClient.query({
            TableName : 'operation',
            KeyConditionExpression: "tenant = :tenantKey and begins_with(operationKey , :operationKey) ",
            ExpressionAttributeValues: {
                ":tenantKey": searchKeys.tenantKey,
                ":operationKey": searchKeys.searchKey,
            }
        }).promise();
        return result.Items;
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}


exports.getById = async function getById(user , jobId){
    try {
        console.log("tenant.getById id=" + jobId);
        const dataKeys=decideDataKeys(user,jobId,0);
        let result = await documentClient.get({
            TableName: "operation",
            Key:{
                "tenant" : dataKeys.tenantKey,
                "operationKey" : dataKeys.dataKey,
            }}).promise();
        return result.Item;
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}

exports.getStatusById = async function getStatusById(user , jobId){
    const job = await this.getById(user , jobId);
    return job.jobStatus;
}

exports.updateJobStatus = async  function updateJobStatus(user, jobId , status ){
    const job = await this.getById(user , jobId);
    console.log("updateJobStatus:" + JSON.stringify(job) );
    const revision  = job.revision + 1;
    const jobStatus = status;
    const prcDate   = getNowYMD();
    const component = 'cfn';
    const keys = decideDataKeys(user,jobId,revision) ;
    console.log("latest保存します。updateJobStatus.revision=" + revision);
    let result = await documentClient.put({
        TableName: "operation",
        "Item" : {
            "tenant"  : keys.tenantKey ,
            "operationKey"    : keys.dataKey,
            "revision"        : revision,
            "jobId"           : jobId,
            "jobStatus"       : jobStatus,
            "component"       : component,
            "name"            : job.name,
            "subname"         : job.subname,
            "started"         : job.started,
            "update"          : prcDate,
            "prcIdKey"        : user.userName, //後でarnに変更
            "prcDate"         : prcDate,
            "data" : job.data
        }
    }).promise();

    console.log("latest保存しました");
    console.log("log保存します");
    result = await documentClient.put({
        TableName: "operation",
        "Item" : {
            "tenant"  : keys.tenantKey ,
            "operationKey"    : keys.logKey,
            "revision"        : revision,
            "jobId"           : jobId,
            "jobStatus"       : jobStatus,
            "component"       : component,
            "name"            : job.name,
            "subname"         : job.subname,
            "started"         : job.started,
            "update"          : prcDate,
            "prcIdKey"        : user.userName, //後でarnに変更
            "prcDate"         : prcDate,
            "data" : job.data
        }
    }).promise();
    console.log("log保存しました");
    console.log("currentを保存します");
    result = await documentClient.put({
        TableName: "operation",
        "Item" : {
            "tenant"  : keys.tenantKey ,
            "operationKey"    : keys.currentKey,
            "revision"        : revision,
            "jobId"           : jobId,
            "jobStatus"       : jobStatus,
            "component"       : component,
            "name"            : job.name,
            "subname"         : job.subname,
            "started"          : job.started,
            "update"          : prcDate,
            "prcIdKey"        : user.userName, //後でarnに変更
            "prcDate"         : prcDate,
            "data" : job.data
        }
    }).promise();
    return jobId;

}

exports.createJob = async  function createJob(user, job , name , subname ){
    try {
        console.log("createJob");
        const e_time = new Date();
        const jobId = e_time.getTime();
        const revision  = 1;
        const jobStatus = 0;
        const prcDate   = getNowYMD();
        const component = 'cfn';
        const keys = decideDataKeys(user,jobId,revision) ;
        console.log("latest保存します。createJob.dataKey=" + keys.dataKey);
        let result = await documentClient.put({
            TableName: "operation",
            "Item" : {
                "tenant"  : keys.tenantKey ,
                "operationKey"    : keys.dataKey,
                "revision"        : revision,
                "jobId"           : jobId,
                "jobStatus"       : jobStatus,
                "component"       : component,
                "name"            : name,
                "subname"         : subname,
                "started"          : prcDate,
                "update"          : prcDate,
                "prcIdKey"        : user.userName, //後でarnに変更
                "prcDate"         : prcDate,
                "data" : job
            }
        }).promise();

        console.log("latest保存しました");
        console.log("log保存します");
        result = await documentClient.put({
            TableName: "operation",
            "Item" : {
                "tenant"  : keys.tenantKey ,
                "operationKey"    : keys.logKey,
                "revision"        : revision,
                "jobId"           : jobId,
                "jobStatus"       : jobStatus,
                "component"       : component,
                "name"            : name,
                "subname"         : subname,
                "started"          : prcDate,
                "update"          : prcDate,
                "prcIdKey"        : user.userName, //後でarnに変更
                "prcDate"         : prcDate,
                "data" : job
            }
        }).promise();
        console.log("log保存しました");
        console.log("currentを保存します");
        result = await documentClient.put({
            TableName: "operation",
            "Item" : {
                "tenant"  : keys.tenantKey ,
                "operationKey"    : keys.currentKey,
                "revision"        : revision,
                "jobId"           : jobId,
                "jobStatus"       : jobStatus,
                "component"       : component,
                "name"            : name,
                "subname"         : subname,
                "started"          : prcDate,
                "update"          : prcDate,
                "prcIdKey"        : user.userName, //後でarnに変更
                "prcDate"         : prcDate,
                "data" : job
            }
        }).promise();
        console.log("currentを保存しました");
        return jobId;
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}

exports.finishJob = async  function finishJob(user, jobId , jobResult ){
    const job = await this.getById(user , jobId);
    console.log("updateJobStatus:" + JSON.stringify(job) );
    const revision  = job.revision + 1;
    const jobStatus = 10;
    const prcDate   = getNowYMD();
    const component = 'cfn';
    const keys = decideDataKeys(user,jobId,revision) ;
    console.log("latest保存します。updateJobStatus.revision=" + revision);
    let result = await documentClient.put({
        TableName: "operation",
        "Item" : {
            "tenant"  : keys.tenantKey ,
            "operationKey"    : keys.dataKey,
            "revision"        : revision,
            "jobId"           : jobId,
            "jobStatus"       : jobStatus,
            "component"       : component,
            "name"            : job.name,
            "subname"         : job.subname,
            "started"         : job.started,
            "update"          : prcDate,
            "finished"        : prcDate,
            "result"          : jobResult,
            "prcIdKey"        : user.userName, //後でarnに変更
            "prcDate"         : prcDate,
            "data" : job.data
        }
    }).promise();

    console.log("latest保存しました");
    console.log("log保存します");
    result = await documentClient.put({
        TableName: "operation",
        "Item" : {
            "tenant"  : keys.tenantKey ,
            "operationKey"    : keys.logKey,
            "revision"        : revision,
            "jobId"           : jobId,
            "jobStatus"       : jobStatus,
            "component"       : component,
            "name"            : job.name,
            "subname"         : job.subname,
            "started"         : job.started,
            "update"          : prcDate,
            "finished"        : prcDate,
            "result"          : jobResult,
            "prcIdKey"        : user.userName, //後でarnに変更
            "prcDate"         : prcDate,
            "data" : job.data
        }
    }).promise();
    console.log("log保存しました");
    console.log("currentを削除します");
    await documentClient.delete({
        TableName: "operation",
        "Key" : {
            "tenant"  : keys.tenantKey ,
            "operationKey"    : keys.currentKey,
        }
    }).promise();
    console.log("currentを削除しました");
    return jobId;

}
