const sendToEs = require("sendToEs");

function decideIndex(db , user){
    return db.db + "_" +  user.mt + "_" + user.stage + "_" + db.table + "_" + user.schema;
}


exports.upsert = function upsert(db , user , data ) {
    const index  = decideIndex(db , user);
    const type   = 'latest';
    const id     = data.id;
    return sendToEs.upsert(index, type , id , data );
}

exports.delete =  function del(db , user , id ) {
    const index  = decideIndex(db , user);
    const type   = 'latest';
    return sendToEs.delete(index, type , id );
}
