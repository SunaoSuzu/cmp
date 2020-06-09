const operationModule = require("./operation");

exports.handler = async (event) => {
    const userName   = "sunao";
    const mt     = "sutech";  //マルチテナントのテナント
    const stage  = "pro";     //Landscape
    const schem  = "default"; //予備(テナントをくくる者)
    const user   = {mt,stage,schem,userName}

    const path = event.rawPath;
    let jobs = [];
    if(path==="/my.operation"){
        jobs = await operationModule.getCurrentList(user);
    }else{
        jobs = await operationModule.getList(user);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(jobs),
    };
    return response;
};
