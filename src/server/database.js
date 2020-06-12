const AWS = require('aws-sdk'),
    documentClient = new AWS.DynamoDB.DocumentClient();
const util = require('util');

const prefix_latest = "latest";
const prefix_log = "log";


function decideDataKeys(db, user,key,revision){
    return { "tableKey" : decideTenantKey(db,user) ,
        "dataKey" : decideLatestPrefix(user, prefix_latest) + "_" + key,
        "logKey"  : decideLatestPrefix(user, prefix_log) + "_" + key + "_" + revision,
    } ; //入力者までつければ同時入力まで防げるけど。。
}

function decideSearchKeys(db, user){
    return { "tableKey" : user.mt ,
        "searchKey" : decideLatestPrefix(user, prefix_latest)
    } ; //入力者までつければ同時入力まで防げるけど。。
}


function decideLatestPrefix(db, user,prefix){
    return user.schem + "_" +  prefix;
}

function decideTenantKey(db, user){
    return db.db + "_" + db.table + "_" +  user.mt + "_" + user.stage;
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

const TABLE_NAME = "database";


exports.getById = async function getById(db , user , id){
    try {
        console.log("getById " + db.table + " id=" + id);
        const dataKeys=decideDataKeys(user,id,0);
        let result = await documentClient.get({
            TableName: TABLE_NAME,
            Key:{
                "tableKey" : dataKeys.tableKey,
                "dataKey" : dataKeys.dataKey,
            }}).promise();
        return result.Item.data;
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}

exports.getList = async function getList(db,user){
    try {
        const searchKeys = decideSearchKeys(db,user);
        let result = await documentClient.query({
            TableName : TABLE_NAME,
            KeyConditionExpression:  " tableKey = :tableKey and begins_with(dataKey , :dataKey) ",
            ProjectionExpression: "#d",
            ExpressionAttributeNames :{
                "#d" : "data",
            },
            ExpressionAttributeValues: {
                ":tableKey": searchKeys.tableKey,
                ":dataKey": searchKeys.searchKey,
            }
        }).promise();
        return result.Items.map(item => item.data);
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}

exports.upsert = async  function upsert(db , method ,user, json ){
    try {
        console.log("更新or追加");
        if(method==='POST'){
            const e_time = new Date();
            const key = e_time.getTime();  //もうちょいがんばるべし
            json["id"]=key;
            json.revision=0;
        }
        json.revision++;
        const revision  = json.revision;
        const keys = decideDataKeys(db ,user,json.id,revision) ;
        const prcDate   = getNowYMD();
        const saveValue = json;
        console.log("latest保存します。name=" + json.name + "revision=" + revision);
        let result = await documentClient.put({
            TableName: TABLE_NAME,
            "Item" : {
                "tableKey"  : keys.tableKey ,
                "dataKey"    : keys.dataKey,
                "revision"   : revision,
                "id"      : json.id,
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
                "tableKey"  : keys.tableKey ,
                "dataKey"    : keys.logKey,
                "revision"   : revision,
                "id"      : json.id,
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

exports.del = async  function del(db,user, envId ){
    try {
        const dataKeys=decideDataKeys(db,user,envId,0);
        let result = await documentClient.delete({
            TableName: TABLE_NAME,
            Key:{
                "tableKey" : dataKeys.tableKey,
                "dataKey" : dataKeys.dataKey,
            }}).promise();
    }  catch (e) {
        throw e;
    }

}

