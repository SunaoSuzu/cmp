
/*
* EC2を起動を　Wait
* */
exports.wait = function (client, name , id) {

    const ids = [id];

    return Promise.resolve(function () {
        console.log("80-" + name + ".EC2");
    }).then(function () {
    }).then(function (instanceRet) {
        console.log("85-" + name + ".EC2.instanceRunning");
        return client.waitFor('instanceRunning', {InstanceIds:ids}).promise();
    }).then(function (instanceRet) {
        console.log("85-" + name + ".EC2.instanceStatusOk");
        return client.waitFor('instanceStatusOk', {InstanceIds:ids}).promise();
    }).then(function (instanceRet) {
        console.log("85-" + name + ".EC2.systemStatusOk");
        return client.waitFor('systemStatusOk', {InstanceIds:ids}).promise();
    })
}

