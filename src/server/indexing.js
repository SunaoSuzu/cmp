const AWS = require('aws-sdk');
const sender = require("./sendToEs");

exports.handler = (event, context, callback) => {
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
            console.log('image:',image);
            if(image["dataKey"].S.startsWith('pro_default_log')){ //TODO
                console.log("skip");
                continue;
            }
            let postData = {};
            for (const key in image) {
                console.log("key=" + key + " " + image.hasOwnProperty(key));
                if (image.hasOwnProperty(key)) {
                    if (key === 'tenantId') {
                        postData['id'] = image[key].S;
                    } else {
                        const val = image[key];
                        if (val.hasOwnProperty('S')) {
                            postData[key] = val.S;
                        } else if (val.hasOwnProperty('N')) {
                            postData[key] = val.N;
                        } else if (val.hasOwnProperty('M')) {
                            postData[key] = AWS.DynamoDB.Converter.unmarshall(val.M);
                        }
                    }
                }
            }

            const action = {};
            action[actionType] = {};
            action[actionType]._index = 'cmp';
            action[actionType]._type = 'tenant';
            action[actionType]._id = postData['id'];
            console.log("postData['id']=" + action[actionType]._id);
            if(addDoc){
                postData={doc : postData};
            }
            posts += [
                JSON.stringify(action),
            ].concat(noDoc?[]:[JSON.stringify(postData)]).join('\n') + '\n';
        }
    }
    console.log('posts:',posts);
    sender.postDocumentToES(posts, context);
};
