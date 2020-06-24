import axios from "axios";
import {put} from "redux-saga/effects";
import {GET_LIST_SUCCESS} from "../module/ListModule";
import {ERROR} from "../module/TenantAppModule";

const searchSource = process.env.REACT_APP_DEV_SEARCH_SOURCE_URL;
export function* handleRequestList(action) {
    try {
        let executeQuery = {};
        let way = "";
        if(action.keyword!==null&&action.keyword!==""){
            //キーワード検索
            executeQuery = {
                "query": {
                    "multi_match": {
                        "fields": [ "tenantName", "alias"],
                        "query": action.keyword,
                    }
                },
                "_source" : ["data"],
                "from" : action.from,
                "size" : action.size,
                "highlight": { "fields": {"tenantName": {}}}
            };
            way="keyword";
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
            way="simple";
        }

        const res = yield axios.post(searchSource + '/cmp/tenant/_search',
            JSON.stringify(executeQuery) ,
            {headers: {'Content-Type': 'application/json'}}
        );
        res.data["way"]=way;
        yield put({
            type: GET_LIST_SUCCESS,
            payload : res.data,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: GET_LIST_SUCCESS,
            payload : {hits : {total:0 , hits : []}},
            e,
        });
    }
}
