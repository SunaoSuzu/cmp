import axios from "axios";
import {getContext, put} from "redux-saga/effects";
import {ON_SUCCESS_GET_LIST,ERROR} from "../modules";

const searchSource = process.env.REACT_APP_DEV_SEARCH_SOURCE_URL;
const base = "https://a88ytp7kbf.execute-api.ap-northeast-1.amazonaws.com";

export function* search(action) {
    try {
        const db = yield getContext("db");
        let executeQuery = {};
        let way = "";
        if(action.keyword!==null&&action.keyword!==""){
            const schema = yield getContext("schema");
            const fields = schema.fields.map( field => ("data." + field.name))
            console.log(JSON.stringify(fields));
            //キーワード検索
            executeQuery = {
                "query": {
                    "multi_match": {
                        "fields": fields,
                        "query": action.keyword,
                    }
                },
                "_source" : ["data"],
                "from" : action.from,
                "size" : action.size,
            };
        }else{
            //全件取得
            executeQuery = {
                "query": {
                    "match_all": {}
                },
                "_source" : ["data"],
                "from" :action.from,
                "size" : action.size,
            };
        }
//        const url = searchSource + '/cmp_sutech_pro_product_default/latest/_search';
        const url = base + "/" + db.database + "/" + db.table + "/_search"

        console.log(JSON.stringify(executeQuery));

        const res = yield axios.post(url,
            JSON.stringify(executeQuery) ,
            {headers: {'Content-Type': 'application/json'}}
        );
        yield put({
            type: ON_SUCCESS_GET_LIST,
            payload : res.data,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: ON_SUCCESS_GET_LIST,
            payload : {hits : {total:0 , hits : []}},
            e,
        });
    }
}
export default search;