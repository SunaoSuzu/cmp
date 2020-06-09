const cf = require("./CreateStackCommand");
const tenantModule = require("./tenant");
const operationModule = require("./operation");
const envModule = require("./env");

const AWS = require('aws-sdk');
const util = require('util');

const sqsUrl = "https://sqs.ap-northeast-1.amazonaws.com/510229950882/operate.fifo";
const SQS = new AWS.SQS();


exports.handler = async (event,ctx) => {
    const userName   = "sunao";
    const mt     = "sutech";  //マルチテナントのテナント
    const stage  = "pro";     //Landscape
    const schem  = "default"; //予備(テナントをくくる者)
    const user   = {mt,stage,schem,userName}

    const config = {
        region: "ap-northeast-1",
        accessKeyId:"AKIAXNTATGGREQAIZFRE",
        secretAccessKey:"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"
    };
    try{
        //サボってる（lamdaを分けるのが正しい）
        const fromSqs = event.Records === undefined ? false : true;
        if(fromSqs){
            //とりあえずwatchしかないとしよう（ループもないんじゃないかと思うけど。。）
            for(let record of event.Records){
                const data = record.body;
                const json = JSON.parse(data);
                const stackName = json.stackName;
                const jobId = json.jobId;
                const env   = json.env;

                console.log("watch");
                env.stack.watchStarted = getNowYMD();
                await envModule.upsert("PUT",user , env);
                const ret = await cf.watch(config,stackName);
                await operationModule.finishJob(user , jobId , ret);
                env.stack = {...env.stack,finish :getNowYMD() , map : ret};
                env.status=10
                await envModule.upsert("PUT",user , env);
            }

        }else{
            //とりあえずcreateしかないとしよう
            console.log("operate");
            const data = event.isBase64Encoded ? new Buffer(event.body,'base64') : event.body;

            const json = JSON.parse(data);
            const tenant   = json.tenant;
            const env   = json.env;
            const stackName = json.stackName;
            const template = json.template;

            const jobId = await operationModule.createJob(user , template ,tenant,env, stackName , "-");

            tenant.status=100;

            env.stack={
                name     : stackName,
                jobId    : jobId,
                template : template,
                started  : getNowYMD()
            }
            env.createdJobId=jobId;
            env.jobHistory=[jobId];

            const ret = await cf.prepare(config,stackName,JSON.stringify(template),true);
            await operationModule.updateJobStatus(user , jobId , 1);
            env.status=5;
            await tenantModule.upsert("PUT",user , tenant);
            await envModule.upsert("PUT",user , env);

            console.log(" SQSへ送信します");
            const message = {
                command : "watch",
                stackName : stackName,
                env : env,
                jobId:jobId,
            };

            await SQS.sendMessage({
                QueueUrl : sqsUrl,
                MessageBody : JSON.stringify(message),
                MessageGroupId : "cloudFormationWatch-" + stackName
            }).promise();

            const response = {
                statusCode: 200,
                headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({tenant : tenant , env : env}),
            };
            return response;
        }
    }catch (e) {
        console.log("🐱" + util.inspect(e, false, null));
    }
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
