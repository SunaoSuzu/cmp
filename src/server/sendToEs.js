const AWS = require('aws-sdk');
const esDomain = {
    endpoint: "https://search-develop-es-l3qa6a6eerel635reuhhdoyape.ap-northeast-1.es.amazonaws.com",
    region: "ap-northeast-1",
};

const endpoint = new AWS.Endpoint(esDomain.endpoint);
const credentials = new AWS.EnvironmentCredentials('AWS');

exports.postDocumentToES = function postDocumentToES(doc, context) {
    const req = new AWS.HttpRequest(endpoint,esDomain.region);

    req.method = 'POST';
    req.path = '/_bulk';
    req.region = esDomain.region;
    req.body = doc;
    req.headers['presigned-expires'] = false;
    req.headers['Host'] = endpoint.host;
    req.headers['Content-Type'] = 'application/json';

    console.log(JSON.stringify(req));

    // Sign the request (Sigv4)
    const signer = new AWS.Signers.V4(req, 'es');
    signer.addAuthorization(credentials, new Date());

    // Post document to ES
    const send = new AWS.NodeHttpClient();
    send.handleRequest(req, null, function (httpResp) {
        var body = '';
        httpResp.on('data', function (chunk) {
            body += chunk;
        });
        httpResp.on('end', function (chunk) {
            console.log('Successful', body);
            context.succeed();
        });
    }, function (err) {
        console.log('Error: ' + err);
        context.fail();
    });
}
