const tenant = require("tenant");
const command = require("env");
const util = require('util');

const CORS_HEADER = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' };

exports.handler = async ( event, context,callback ) => {
    const userName   = "sunao";
    const mt     = "sutech";  //マルチテナントのテナント
    const stage  = "pro";     //Landscape
    const schem  = "default"; //予備(テナントをくくる者)
    const user   = {mt,stage,schem,userName}

    const encoded = event.isBase64Encoded;
    const method  = event.httpMethod;
    const path = event.path;

    console.log("BEGIN");
    console.log("event.httpMethod=" + method);
    console.log("event.pathParameters=" + event.pathParameters);
    console.log("event.isBase64Encoded=" + encoded);
    console.log("event.path=" + event.path);

    if(path.startsWith("/env")){
        console.log("/env");
        const body = event.body;
        let decode=null;
        if(encoded){
            decode = new Buffer(body,'base64');
        }else{
            decode = body;
        }
        const json = JSON.parse(decode);
        switch (method) {
            case 'POST':{
                console.log("/env add");
                const e  = json.env;
                const t  = json.tenant;

                const result = await command.upsert(method,user,e);
                if(t.envIds===undefined)t.envIds=[];
                t.envIds.push(result.id);
                const saveValue=await tenant.upsert("PUT",user,t);  //更新
                result.tenantId=saveValue.id;
                const ev = await command.upsert("PUT",user,result); //ID取得を外だししていずれ撲滅

                callback(null, {"statusCode": 200, 'headers': CORS_HEADER,"body": JSON.stringify({env : ev , tenant : saveValue}) });
                break
            }
            case 'PUT':{
                console.log("/env mo");
                const ev = await command.upsert(method,user,json);
                callback(null, {"statusCode": 200, 'headers': CORS_HEADER,"body": JSON.stringify(ev) });
                break
            }
        }
    }else{
        switch (method) {
            case 'GET':{
                if(event.pathParameters===undefined){
                    let ret = await tenant.getList(user);
                    callback(null, {"statusCode": 200,'headers': CORS_HEADER,"body": JSON.stringify(ret)});
                    break;
                }else{
                    try {
                        const tenantId = decodeURIComponent(event.pathParameters.tenantId);
                        const data = await tenant.getById(tenantId,user);
                        let envs = [];
                        if(data.envIds!==undefined){
                            envs = await Promise.all(data.envIds.map(async id => {
                                return await command.getById(user,id);
                            }));
                        }

                        callback(null, {"statusCode": 200, 'headers': CORS_HEADER,"body": JSON.stringify({tenant:data, environments : envs }) });
                    } catch (e) {
                        callback(null, {"statusCode": 500, 'headers': CORS_HEADER,"body": e });
                    }
                }
                break
            }
            case "POST":
            case "PUT":
            {
                try {
                    console.log("更新or追加");
                    const body = event.body;
                    let decode=null;
                    if(encoded){
                        decode = new Buffer(body,'base64');
                    }else{
                        decode = body;
                    }
                    const json = JSON.parse(decode);
                    if(method==="PUT"){
                        const t = json.tenant;
                        const envs = json.envs;
                        const saveValue=await tenant.upsert(method,user,t);
                        const senvs = await Promise.all(envs.map(async env => {
                            return await command.upsert(method , user, env);
                        }));
                        callback(null, {"statusCode": 200, 'headers': CORS_HEADER,"body": JSON.stringify({tenant:saveValue , envs : senvs}) });
                    }else{
                        const saveValue=await tenant.upsert(method,user,json);
                        callback(null, {"statusCode": 200, 'headers': CORS_HEADER,"body": JSON.stringify(saveValue) });
                    }
                } catch (e) {
                    console.log("🐱" + util.inspect(e, false, null));
                    callback(null, {"statusCode": 500, 'headers': CORS_HEADER,"body": e });
                }
            }
                break;
            case "DELETE":{
                try {
                    const tenantId = decodeURIComponent(event.pathParameters.tenantId);
                    await tenant.del(user , tenantId);
                    callback(null, {"statusCode": 200, 'headers': CORS_HEADER,"body": "" });
                } catch (e) {
                    console.log(e.name + ': ' + e.message);
                    console.log("🐱" + util.inspect(e, false, null));
                    callback(null, {"statusCode": 511, 'headers': CORS_HEADER,"body": e });
                }
                break;
            }
            default:
        }

    }
    callback(null, {"statusCode": 500, 'headers': CORS_HEADER,"body": "error"});
};

