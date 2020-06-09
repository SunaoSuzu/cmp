const operation   = require("../operation");
const userName   = "sunao";
const mt     = "sutech";  //マルチテナントのテナント
const stage  = "pro";     //Landscape
const schem  = "default"; //予備(テナントをくくる者)
const user   = {mt,stage,schem,userName}


async function test(){
    const jobId = await operation.createJob(user, {job:"xxx"},"n","s");
    const status = await operation.getStatusById(user , jobId);
    console.log("status=" + status);
    await operation.updateJobStatus(user , jobId , 1);
    const newStatus = await operation.getStatusById(user , jobId);
    console.log("status=" + newStatus);
    const jobs = await operation.getMyCurrentList(user);
    console.log("jobs=" + JSON.stringify(jobs));
    await operation.finishJob(user , jobId , {sum : 10});
    const lastStatus = await operation.getStatusById(user , jobId);
    const newjobs = await operation.getMyCurrentList(user);
    console.log("status=" + lastStatus);
    console.log("jobs=" + JSON.stringify(newjobs));
    const latests = await operation.getList(user);
    console.log("jobs=" + JSON.stringify(latests));
}
test();
