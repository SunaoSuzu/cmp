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

    //いずれApiKeyを取得する必要がある
    const config = {
        region: "ap-northeast-1",
    };
    try{
        //サボってる（lamdaを分けるのが正しい）
        const fromSqs = event.Records === undefined ? false : true;
        if(fromSqs){
            //とりあえずwatchしかないとしよう（ループもないんじゃないかと思うけど。。）
            for(let record of event.Records){
                const data = record.body;
                const json = JSON.parse(data);
                const command = json.command;
                const stackName = json.stackName;
                const jobId = json.jobId;
                const env   = json.env;
                let counter   = json.counter;

                if(command==="watch"){
                    console.log("watch");
                    const {status , events} = await cf.events(config,stackName);
                    console.log("status=" + status);
                    if (status === "CREATE_COMPLETE"){
                        console.log("CREATE_COMPLETE")
                        const {resources} = await cf.watch(config,stackName);
                        await operationModule.finishJob(user , jobId , resources);
                        env.stack = {...env.stack,finish :getNowYMD() ,status:10, create : resources};
                        env.status=10
                        await envModule.upsert("PUT",user , env);
                    }else if (status === "CREATE_FAILED"){
                        console.log("CREATE_FAILED")
                        await operationModule.finishJob(user , jobId , "CREATE_FAILED");
                        env.stack = {...env.stack,finish :getNowYMD() ,status:20};
                        env.status=20
                        await envModule.upsert("PUT",user , env);
                    }else if (status === "CREATE_IN_PROGRESS"){
                        console.log("CREATE_IN_PROGRESS")
                        await operationModule.updateJobStatus(user , jobId , 1,events);
                        counter++;
                        const message = {
                            command : "watch",
                            stackName : stackName,
                            env : env,
                            jobId:jobId,
                            counter: counter,
                        };

                        await SQS.sendMessage({
                            QueueUrl : sqsUrl,
                            MessageBody : JSON.stringify(message),
                            MessageGroupId : "cloudFormationWatch-" + stackName + "_" + counter
                        }).promise();
                        console.log("SendAgain")
                    }
                }else if(command==="watchExecChangeSet"){
                    const changeSetName = json.changeSetName;
                    console.log("watchExecChangeSet");
                    const {status , events} = await cf.events(config,stackName);
                    console.log("status=" + status);
                    if (status === "UPDATE_COMPLETE"){
                        console.log("UPDATE_COMPLETE")
                        const ret = await cf.watchExecChangeSet(config,stackName,changeSetName);
                        await operationModule.finishJob(user , jobId , ret);
                        env.status=10
                        env.stack = {...env.stack,finish :getNowYMD() ,status:10, ret : ret};
                        await envModule.upsert("PUT",user , env);
                    }else if (status === "UPDATE_IN_PROGRESS"||status === "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS"){
                        console.log("UPDATE_IN_PROGRESS")
                        await operationModule.updateJobStatus(user , jobId , 1,events);
                        counter++;
                        const message = {
                            command : "watchExecChangeSet",
                            stackName : stackName,
                            changeSetName : changeSetName,
                            env : env,
                            jobId:jobId,
                            counter : counter,
                        };

                        await SQS.sendMessage({
                            QueueUrl : sqsUrl,
                            MessageBody : JSON.stringify(message),
                            MessageGroupId : "cloudFormationWatchExec-" + stackName + "-" + changeSetName + "_" + counter
                        }).promise();
                    }else {
                        console.log("UPDATE_FAILED")
                        await operationModule.finishJob(user , jobId , status);
                        env.stack = {...env.stack,finish :getNowYMD() ,status:20};
                        env.status=20
                        await envModule.upsert("PUT",user , env);
                    }
                }else{
                    console.log("watchChangeSet");
                    const changeSetName = json.changeSetName;
                    const {status , ret} = await cf.watchChangeSet(config,stackName,changeSetName);
                    if( status === "CREATE_COMPLETE"){
                        await operationModule.finishJob(user , jobId , ret);
                        env.status=15
                        env.stack = {...env.stack,finish :getNowYMD() ,status:10, changeSet : ret};
                        await envModule.upsert("PUT",user , env);
                    }else {
                        await operationModule.finishJob(user , jobId , status);
                        env.status=20
                        env.stack = {...env.stack,finish :getNowYMD() ,status:20, changeSet : ret};
                        await envModule.upsert("PUT",user , env);
                    }
                }
            }
        }else{
            console.log("operate");
            const data = event.isBase64Encoded ? new Buffer(event.body,'base64') : event.body;

            const json = JSON.parse(data);
            const command = json.command;
            const tenant   = json.tenant;
            const env   = json.env;
            const stackName = json.stackName;
            const template = json.template;

            if(command==="create"){
                console.log("create");
                const jobId = await operationModule.createJob(user , template ,tenant,env, stackName , "-");
                tenant.status=100;
                env.stack={
                    ...env.stack,
                    jobId    : jobId,
                    started  : getNowYMD(),
                }
                env.createdJobId=jobId;
                env.jobHistory=[jobId];
                const stack = await cf.prepare(config,stackName,JSON.stringify(template),true);
                await operationModule.updateJobStatus(user , jobId , 1,stack);
                env.status=5;
                env.stack={
                    ...env.stack,
                    status : 5,
                    exec : stack
                }
                await tenantModule.upsert("PUT",user , tenant);
                await envModule.upsert("PUT",user , env);

                console.log(" SQSへ送信します");
                const message = {
                    command : "watch",
                    stackName : stackName,
                    env : env,
                    jobId:jobId,
                    counter : 0,
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

            }else if(command==="executeChangeSet"){
                console.log("executeChangeSet");
                const changeSetName = env.stack.changeSetName;
                const jobId = await operationModule.createJob(user , env.stack.template ,tenant,env, stackName , changeSetName);
                env.stack={
                    ...env.stack,
                    jobId    : jobId,
                    started  : getNowYMD(),
                }
                env.createdJobId=jobId;
                env.jobHistory.push(jobId);
                const stack = await cf.execChangeSet(config,stackName,changeSetName);
                await operationModule.updateJobStatus(user , jobId , 1,stack);
                env.status=16;
                env.stack={
                    ...env.stack,
                    status : 5,
                    exec : stack
                }
                await envModule.upsert("PUT",user , env);

                console.log(" SQSへ送信します");
                const message = {
                    command : "watchExecChangeSet",
                    stackName : stackName,
                    changeSetName : changeSetName,
                    env : env,
                    jobId:jobId,
                    counter : 0,
                };

                await SQS.sendMessage({
                    QueueUrl : sqsUrl,
                    MessageBody : JSON.stringify(message),
                    MessageGroupId : "cloudFormationWatchExec-" + stackName + "-" + changeSetName
                }).promise();

                const response = {
                    statusCode: 200,
                    headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify(env),
                };
                return response;
            }else{
                console.log("ChangeSet");
                const e_time = new Date();
                const suffix = e_time.getTime();
                const changeSetName = stackName + "ChangeSet" + suffix;
                const jobId = await operationModule.createJob(user , template ,tenant,env, stackName , changeSetName);
                env.stack={
                    ...env.stack,
                    changeSetName : changeSetName,
                    jobId    : jobId,
                    started  : getNowYMD()
                }
                env.latesetJobId=jobId;
                env.jobHistory.push(jobId);
                await envModule.upsert("PUT",user , env);
                const ret = await cf.changeSet(config , stackName , changeSetName , JSON.stringify(template));
                await operationModule.updateJobStatus(user , jobId , 1,ret);
                env.stack = {...env.stack,kicked :getNowYMD() ,status:5, exec : ret};
                env.status=14
                await envModule.upsert("PUT",user , env);

                const message = {
                    command : "watchChangeSet",
                    stackName : stackName,
                    changeSetName : changeSetName,
                    env : env,
                    jobId:jobId,
                    counter : 0,
                };

                await SQS.sendMessage({
                    QueueUrl : sqsUrl,
                    MessageBody : JSON.stringify(message),
                    MessageGroupId : "cloudFormationWatch-" + stackName + "-" + changeSetName
                }).promise();

                const response = {
                    statusCode: 200,
                    headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify(env),
                };
                return response;

            }
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
