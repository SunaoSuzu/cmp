const dao = require("shared");
const util = require('util');
const es = require('es');
const AWS = require("aws-sdk")

const CORS_HEADER = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' };

exports.handlerZ = async (event) => {
    const userName   = "sunao";
    const mt     = "sutech";  //マルチテナントのテナント
    const stage  = "pro";     //Landscape
    const schema  = "default"; //予備(テナントをくくる者)
    const user   = {mt,stage,schema,userName}
    const db    = "cmp";
    const table = "product";
    const dbInfo={db,table}

    const ret=await dao.upsert(dbInfo,"POST",user,{ name : "高橋"});
    const ret2=await es.upsert(dbInfo,user,ret);
}

exports.handler = async (event) => {
    const userName   = event.requestContext.authorizer.jwt.claims["cognito:username"];
    const preferredRole = event.requestContext.authorizer.jwt.claims["cognito:preferred_role"];
    const roleName = preferredRole.split("/")[1];
    const schema  = "default"; //予備(テナントをくくる者)
    const params = event.queryStringParameters;
    const encoded = event.isBase64Encoded;
    const method  = event.httpMethod ? event.httpMethod : event.requestContext.http.method;
    const db    = event.pathParameters.db;
    const table = event.pathParameters.table;
    const id    = event.pathParameters.id;
    const dbInfo={db,table}

    const sts = new AWS.STS()
    const accountId = (await sts.getCallerIdentity({}).promise());
    console.log("account:" + JSON.stringify(accountId));

    const credential = await sts.assumeRole({
        RoleArn: preferredRole,
        RoleSessionName: 'test'
    }).promise()
        .then(data => data)
        .catch(e => console.log(e))

    const user = {
        userName, roleName, schema,preferredRole,
        session : {
            region: process.env.REGION,
            accessKeyId : credential.Credentials.AccessKeyId,
            secretAccessKey : credential.Credentials.SecretAccessKey,
            sessionToken : credential.Credentials.SessionToken,
        }
    };


    try{
        console.log(JSON.stringify(event))
        switch (method) {
            case 'GET':{
                if(id===undefined){
                    const ret = await dao.getList(dbInfo,user,params);
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
                await es.upsert(dbInfo,user,ret);
                return {
                    statusCode: 200,
                    headers : CORS_HEADER,
                    body: JSON.stringify(ret),
                };
            }
            case "DELETE":{
                await dao.del(dbInfo,user , id);
                await es.delete(dbInfo,user,id);

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
