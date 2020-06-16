import axios from "axios";
import {getContext, put} from "redux-saga/effects";
import {ON_SUCCESS_GET_ES_LIST,ON_SUCCESS_SEARCH_ES_LIST} from "../modules";

const base = "https://a88ytp7kbf.execute-api.ap-northeast-1.amazonaws.com";

export function* search(action) {
    try {
        const db = yield getContext("db");
        let executeQuery = {};
        let way = "";
        const schema = yield getContext("schema");
        const fields = schema.fields.map( field => (field.name))
        const search = (action.keyword!==null&&action.keyword!=="");
        const action = search ? ON_SUCCESS_SEARCH_ES_LIST : ON_SUCCESS_GET_ES_LIST;
        if(search){
            //キーワード検索
            executeQuery = {
                "query": {
                    "multi_match": {
                        "fields": fields,
                        "query": action.keyword,
                    }
                },
                "from" : action.from,
                "size" : action.size,
            };
        }else{
            //全件取得
            executeQuery = {
                "query": {
                    "match_all": {}
                },
                "from" :action.from,
                "size" : action.size,
                "sort": { "id": { "order": "desc" } }
            };
        }
        const url = base + "/" + db.database + "/" + db.table + "/_search"

        console.log(JSON.stringify(executeQuery));

        const res = yield axios.post(url,
            JSON.stringify(executeQuery) ,
            {headers: {'Content-Type': 'application/json'}}
        );
        yield put({
            type: action,
            payload : res.data,
            receivedAt: Date.now(),
        });
    } catch (e) {
        //index未作成を考慮
        yield put({
            type: ON_SUCCESS_GET_ES_LIST,
            payload : {hits : {total:0 , hits : []}},
            e,
        });
    }
}
export default search;