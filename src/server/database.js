const AWS = require('aws-sdk'),
    documentClient = new AWS.DynamoDB.DocumentClient();
const util = require('util');

const prefix_latest = "latest";
const prefix_log = "log";


function decideDataKeys(db, user,key,revision){
    return { "tableKey" : decideTenantKey(db,user) ,
        "dataKey" : decidePrefix(db,user, prefix_latest) + "_" + key,
        "logKey"  : decidePrefix(db,user, prefix_log) + "_" + key + "_" + revision,
    } ; //入力者までつければ同時入力まで防げるけど。。
}

function decideSearchKeys(db, user){
    return { "tableKey" : decideTenantKey(db,user) ,
        "searchKey" : decidePrefix(db,user, prefix_latest)
    } ; //入力者までつければ同時入力まで防げるけど。。
}


function decidePrefix(db , user,prefix){
    return db.table + "_" +  user.schema +"_" + prefix;
}

function decideTenantKey(db, user){
    return db.db + "_" +  user.mt + "_" + user.stage;
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

    return y + m + d + hh + mi + ss;
}

const TABLE_NAME = "database";


exports.getById = async function getById(db , user , id){
    try {
        console.log("getById " + db.table + " id=" + id);
        const dataKeys=decideDataKeys(db , user,id , 0);
        let result = await documentClient.get({
            TableName: TABLE_NAME,
            Key:{
                "tableKey" : dataKeys.tableKey,
                "dataKey" : dataKeys.dataKey,
            }}).promise();
        console.log(JSON.stringify(result))
        return result.Item.data;
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}

exports.getList = async function getList(db,user,params){
    console.log("getList:" + JSON.stringify(db));
    const queryPrams = {};
    if(params.limit===undefined)queryPrams.Limit=params.limit;
    if(params.forward===undefined)queryPrams.ScanIndexForward=params.forward;
    try {
        const searchKeys = decideSearchKeys(db,user);
        console.log("getList:" + JSON.stringify(searchKeys));
        let result = await documentClient.query({
            ...queryPrams,
            TableName : TABLE_NAME,
            KeyConditionExpression:  " tableKey = :tableKey and begins_with(dataKey , :dataKey) ",
            ProjectionExpression: "#d",
            ExpressionAttributeNames :{
                "#d" : "data",
            },
            ExpressionAttributeValues: {
                ":tableKey": searchKeys.tableKey,
                ":dataKey": searchKeys.searchKey,
            },
            ScanIndexForward: false,
        }).promise();
        return result.Items.map(item => item.data);
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
        throw e;
    }
}

exports.upsert = async  function upsert(db , method ,user, json ){
    console.log("upsert:" + JSON.stringify(db));
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
        console.log("latest保存します。saveValue=" + JSON.stringify(saveValue) + "revision=" + revision);
        let result = await documentClient.put({
            TableName: TABLE_NAME,
            "Item" : {
                "tableKey"   : keys.tableKey ,
                "dataKey"    : keys.dataKey,
                "db"         : db.db,
                "table"      : db.table,
                "tenant"     : user.mt,
                "env"        : user.stage,
                "schema"     : user.schema,
                "id"         : json.id,
                "revision"   : revision,
                "prcIdKey"   : user.userName, //後でarnに変更
                "prcDate"    : prcDate,
                "data" : saveValue
            }
        }).promise();

        console.log("latest保存しました");
        console.log("log保存します。name=" + json.id + "revision=" + revision);
        result = await documentClient.put({
            TableName: TABLE_NAME,
            "Item" : {
                "tableKey"  : keys.tableKey ,
                "dataKey"    : keys.logKey,
                "db"         : db.db,
                "table"      : db.table,
                "tenant"     : user.mt,
                "env"        : user.stage,
                "schema"     : user.schema,
                "id"         : json.id,
                "revision"   : revision,
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

exports.del = async  function del(db,user, id ){
    try {
        const dataKeys=decideDataKeys(db,user,id,0);
        await documentClient.delete({
            TableName: TABLE_NAME,
            Key:{
                "tableKey" : dataKeys.tableKey,
                "dataKey" : dataKeys.dataKey,
            }}).promise();
    }  catch (e) {
        throw e;
    }
}

