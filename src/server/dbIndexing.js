const AWS = require('aws-sdk');
const sender = require("./sendToEs");


exports.handler = (event, context) => {
    console.log("event => " + JSON.stringify(event));
    let posts = '';

    for (let i = 0; i < event.Records.length; i++) {
        const eventName = event.Records[i].eventName;
        let actionType = '';
        let image;
        let noDoc = false;
        let addDoc = false;
        switch (eventName) {
            case 'INSERT':
                actionType = 'create';
                image = event.Records[i].dynamodb.NewImage;
                break;
            case 'MODIFY':
                actionType = 'update';
                image = event.Records[i].dynamodb.NewImage;
                addDoc=true;
                break;
            case 'REMOVE':
                actionType = 'delete';
                image = event.Records[i].dynamodb.OldImage;
                noDoc = true;
                break;
        }

        if (typeof image !== "undefined") {
            const json = AWS.DynamoDB.Converter.unmarshall(image);

            const dataKey =json.dataKey;
            const prefix = json.table + "_" + json.schema;
            if(dataKey.startsWith(prefix + "_log")){
                console.log("skip:" + dataKey);
                continue;
            }

            const id = json.id;
            const data = json.data;
            const postData = { id : id , data : data};

            const action = {};
            action[actionType] = {};
            action[actionType]._index = json.tableKey + "_" + prefix;
            action[actionType]._type = "latest";
            action[actionType]._id = id;
            const sendDoc = addDoc ? {doc : postData} : postData;
            posts += [
                JSON.stringify(action),
            ].concat(noDoc?[]:[JSON.stringify(sendDoc)]).join('\n') + '\n';
        }
    }
    console.log('posts:',posts);
    if(posts!=='')sender.postDocumentToES(posts, context);
};
