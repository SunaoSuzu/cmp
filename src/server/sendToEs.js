const AWS = require('aws-sdk');
const util = require('util');
const esDomain = {
    endpoint: "https://search-develop-es-l3qa6a6eerel635reuhhdoyape.ap-northeast-1.es.amazonaws.com",
    region: "ap-northeast-1",
};

const endpoint = new AWS.Endpoint(esDomain.endpoint);
const credentials = new AWS.EnvironmentCredentials('AWS');

exports.upsert = function upsert(index , type , id , data ) {
    const url = '/' + index + '/' + type + '/' + id;
    return this.sendImpl("PUT" , url , JSON.stringify(data) );
}

exports.delete = function del(index , type , id) {
    const url = '/' + index + '/' + type + '/' + id;
    return this.sendImpl("DELETE" , url , "")
}

exports.postDocumentToES = function postDocumentToES(doc, context) {
    return this.sendImpl("POST" , '/_bulk' , doc ,context )
}

exports.sendImpl = async function sendImpl(method , path , body,context) {
    const req = new AWS.HttpRequest(endpoint,esDomain.region);

    req.method = method;
    req.path = path;
    req.region = esDomain.region;
    req.body = body;
    req.headers['presigned-expires'] = false;
    req.headers['Host'] = endpoint.host;
    req.headers['Content-Type'] = 'application/json';


    // Sign the request (Sigv4)
    const signer = new AWS.Signers.V4(req, 'es');
    signer.addAuthorization(credentials, new Date());

    // Post document to ES
    const send = new AWS.NodeHttpClient();
    console.log(JSON.stringify(req));

    const result = await (() =>
        new Promise(resolve => {
            send.handleRequest(req, null, function (httpResp) {
                var body = '';
                httpResp.on('data', function (chunk) {
                    body += chunk;
                });
                httpResp.on('end', function (chunk) {
                    console.log('Successful', body);
                    if(context!==undefined)context.succeed();
                    resolve(body)
                });
            }, function (err) {
                console.log('Error: ' + err);
                if(context!==undefined)context.fail();
                resolve(err)
            });
        }))()
    console.log(JSON.stringify(result));

}
