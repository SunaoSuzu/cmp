const env = {"name":"開発環境",revision : 1,"landScape":1,"status":1,"statusCaption":"下書き","strategy":{"web":{},"bastion":{},"network":{}},"specLevel":2,"vpcType":1,"vpcTypeCaption":"独自VPC","mainComponents":[{"id":99,"name":"SpringBootAp","caption":"SpringBootAp","type":1,"params":[]}],"subComponents":[]}

const command   = require("./env");
const userName   = "sunao";
const mt     = "sutech";  //マルチテナントのテナント
const stage  = "pro";     //Landscape
const schem  = "default"; //予備(テナントをくくる者)
const user   = {mt,stage,schem,userName}

async function test() {
    const ins = await command.upsert("POST", user, env);
    console.log(ins.id);

    const data = await command.getById(user,ins.id);
    console.log(data.id);

    const upd = await command.upsert("PUT", user, env);
    console.log(upd.id);

    const del = await command.del(user,ins.id);
}
test()