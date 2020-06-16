const AWS = require('aws-sdk'),
    documentClient = new AWS.DynamoDB.DocumentClient({region : "ap-northeast-1"});
const util = require('util');

const prefix_latest = "latest";
const prefix_log = "log";


function decideDataKeys(user,key,revision){
    return { "tenantKey" : user.mt ,
        "dataKey" : decideLatestPrefix(user, prefix_latest) + "_" + key,
        "logKey"  : decideLatestPrefix(user, prefix_log) + "_" + key + "_" + revision,
    } ; //入力者までつければ同時入力まで防げるけど。。
}

function decideSearchKeys(user){
    return { "tenantKey" : user.mt ,
        "searchKey" : decideLatestPrefix(user, prefix_latest)
    } ; //入力者までつければ同時入力まで防げるけど。。
}


function decideLatestPrefix(user,prefix){
    return user.stage + "_" + user.schem + "_" +  prefix;
}


function getNowYMD(){
    var dt = new Date();
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth()+1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);

    var hh = dt.getHours();
    var mi = dt.getMinutes();
    var ss = dt.getSeconds();

    hh = ("00" + hh).slice(-2);
    mi = ("00" + mi).slice(-2);
    ss = ("00" + ss).slice(-2);

    var result = y + m + d + hh + mi + ss;
    return result;
}

const TABLE_NAME = "environment";


exports.getById = async function getById(user,envId){
    try {
        console.log("env.getById id=" + envId);
        const dataKeys=decideDataKeys(user,envId,0);
        let result = await documentClient.get({
            TableName: TABLE_NAME,
            Key:{
                "tenant" : dataKeys.tenantKey,
                "envKey" : dataKeys.dataKey,
            }}).promise();
        return result.Item.data;
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}

exports.getList = async function getList(user){
    console.log("getByListImpl:" + JSON.stringify(user));
    try {
        const searchKeys = decideSearchKeys(user);
        let result = await documentClient.query({
            TableName : TABLE_NAME,
            KeyConditionExpression:  " tenant = :tenantKey and begins_with(envKey , :dataKey) ",
            ProjectionExpression: "#d",
            ExpressionAttributeNames :{
                "#d" : "data",
            },
            ExpressionAttributeValues: {
                ":tenantKey": searchKeys.tenantKey,
                ":dataKey": searchKeys.searchKey,
            }
        }).promise();
        return result.Items.map(item => item.data);
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}

exports.getLatestN = async function getLatestN(user,size){
    console.log("getByListImpl:" + JSON.stringify(user));
    try {
        const searchKeys = decideSearchKeys(user);
        let result = await documentClient.query({
            TableName : TABLE_NAME,
            KeyConditionExpression:  " tenant = :tenantKey and begins_with(envKey , :dataKey) ",
            ProjectionExpression: "#d",
            ExpressionAttributeNames :{
                "#d" : "data",
            },
            ExpressionAttributeValues: {
                ":tenantKey": searchKeys.tenantKey,
                ":dataKey": searchKeys.searchKey,
            },
            ScanIndexForward: false,
            Limit : size
        }).promise();
        return result.Items.map(item => item.data);
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}


exports.upsert = async  function upsert(method ,user, json ){
    try {
        console.log("更新or追加");
        const e_time = new Date();
        const key = e_time.getTime();  //TODO サロゲート？
        if(method==='POST'){
            json["id"]=key;
            json.revision=0;
        }
        json.revision++;
        const revision  = json.revision;
        const keys = decideDataKeys(user,json.id,revision) ;
        const prcDate   = getNowYMD();
        let saveValue = json;
        console.log("latest保存します。name=" + json.name + "revision=" + revision);
        let result = await documentClient.put({
            TableName: TABLE_NAME,
            "Item" : {
                "tenant"  : keys.tenantKey ,
                "envKey"    : keys.dataKey,
                "revision"   : revision,
                "envId"      : json.id,
                "envName" : json.name,
                "prcIdKey"   : user.userName, //後でarnに変更
                "prcDate"    : prcDate,
                "data" : saveValue
            }
        }).promise();

        console.log("latest保存しました");
        console.log("log保存します。name=" + json.name + "revision=" + revision);
        result = await documentClient.put({
            TableName: TABLE_NAME,
            "Item" : {
                "tenant"  : keys.tenantKey ,
                "envKey"    : keys.logKey,
                "revision"   : revision,
                "envId"   : json.id,
                "envName" : json.name,
                "prcIdKey"   : user.userName, //後でarnに変更
                "prcDate"    : prcDate,
                "data" : saveValue
            }
        }).promise();
        return saveValue;
    } catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }

}

exports.del = async  function del(user, envId ){
    try {
        const dataKeys=decideDataKeys(user,envId,0);
        let result = await documentClient.delete({
            TableName: TABLE_NAME,
            Key:{
                "tenant" : dataKeys.tenantKey,
                "envKey" : dataKeys.dataKey,
            }}).promise();
    }  catch (e) {
        throw e;
    }

}

