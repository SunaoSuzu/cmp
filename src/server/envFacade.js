/**
 * いずれ廃棄
 * */
const env = require("env");

const db = {db :"cmp" , table:"environment"}

exports.getById = async function getById(db , user,envId){
    return env.getById(user,envId);
}

exports.getList = async function getList(db , user){
    return env.getList(user);
}

exports.getLatestN = async function getLatestN(db , user , size){
    return env.getLatestN(user,size);
}


exports.upsert = async  function upsert(db , method ,user, json ){
    return env.upsert(method ,user, json);
}

exports.del = async  function del(db , user, envId ){
    return env.del(envId);
}

