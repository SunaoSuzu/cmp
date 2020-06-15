const envDao = require("envFacade");
const databaseDao = require("database");
const util = require('util');

function selectDao(db){
    if(db.table === "environment"){
        return envDao;
    }else{
        return databaseDao;
    }

}

const CORS_HEADER = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' };

exports.handler = async (event) => {
    const userName   = "sunao";
    const mt     = "sutech";  //マルチテナントのテナント
    const stage  = "pro";     //Landscape
    const schema  = "default"; //予備(テナントをくくる者)
    const user   = {mt,stage,schema,userName}
    const encoded = event.isBase64Encoded;
    const method  = event.requestContext.http.method;
    const db    = event.pathParameters.db;
    const table = event.pathParameters.table;
    const id    = event.pathParameters.id;
    const dbInfo={db,table}
    const dao   = selectDao(dbInfo);

    try{
        switch (method) {
            case 'GET':{
                if(id===undefined){
                    const ret = await dao.getList(dbInfo,user);
                    return {
                        statusCode: 200,
                        headers : CORS_HEADER,
                        body: JSON.stringify(ret),
                    };
                }else{
                    const data = await dao.getById(dbInfo,user,id);
                    return {
                        statusCode: 200,
                        headers : CORS_HEADER,
                        body: JSON.stringify(data),
                    };
                }
            }
            case "POST":
            case "PUT":
            {
                const decode=encoded ? new Buffer(event.body,'base64') : event.body;
                const json = JSON.parse(decode);
                const ret=await dao.upsert(dbInfo,method,user,json);
                return {
                    statusCode: 200,
                    headers : CORS_HEADER,
                    body: JSON.stringify(ret),
                };
            }
            case "DELETE":{
                await dao.del(dbInfo,user , id);
                return {
                    statusCode: 200,
                    headers : CORS_HEADER,
                    body: "",
                };
            }
            default:
                return {
                    statusCode: 503,
                    headers : CORS_HEADER,
                    body: "ERROR NO METHOD :" + method,
                };
        }

    }catch(e){
        console.log("🐱" + util.inspect(e, false, null));
        return {
            statusCode: 503,
            headers : CORS_HEADER,
            body: JSON.stringify(e),
        };
    }
};
