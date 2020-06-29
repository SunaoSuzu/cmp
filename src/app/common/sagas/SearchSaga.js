import {getContext, put} from "redux-saga/effects";
import {ERROR, ON_SUCCESS_GET_ES_LIST, ON_SUCCESS_SEARCH} from "../modules";
import { postRequest} from '../../../platform/util/Common';

const base = process.env.REACT_APP_DEV_PLATFORM + "/data";


export function* search(action) {
    try {
        const db = yield getContext("db");
        const schema = yield getContext("schema");
        let executeQuery = {};
        const fields = schema.fields.map( field => (field.field))
        const search = (action.payload.keyword!==null&&action.payload.keyword!=="");
        const success = search ? ON_SUCCESS_SEARCH : ON_SUCCESS_GET_ES_LIST;
        if(search){
            //キーワード検索
            executeQuery = {
                "query": {
                    "multi_match": {
                        "fields": fields,
                        "query": action.payload.keyword,
                    }
                },
                "from" : action.payload.from,
                "size" : action.payload.size,
            };
        }else{
            //全件取得
            executeQuery = {
                "query": {
                    "match_all": {}
                },
                "from" :action.payload.from,
                "size" : action.payload.size,
                "sort": { "id": { "order": "desc" } }
            };
        }
        const url = base + "/" + db.database + "/" + db.table + "/_search"

        console.log(JSON.stringify(executeQuery));

        const token = yield getContext("token");

        yield postRequest({
            url: url,
            token : token,
            data : JSON.stringify(executeQuery) ,
            onSuccess: success,
        });

    } catch (error) {
        //index未作成をとりあえず考慮してエラーにしないようにはする
        yield put({
            type: "ERROR",
            payload : {hits : {total:0 , hits : []}},
            error,
        });
    }
}
export default search;