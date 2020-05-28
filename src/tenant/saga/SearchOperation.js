import axios from "axios";
import {put} from "redux-saga/effects";
import * as TenantAppModule from "../TenantAppModule";

const searchSource = process.env.REACT_APP_DEV_SEARCH_SOURCE_URL;
function* handleRequestList(action) {
    try {
        let executeQuery = {};
        let way = "";
        if(action.keyword!=null&&action.keyword!=""){
            //キーワード検索
            executeQuery = {
                "query": {
                    "multi_match": {
                        "fields": [ "tenantName", "alias"],
                        "query": "鈴木",
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

        console.log(executeQuery);
        const res = yield axios.post(searchSource + '/cmp/tenant/_search',
            JSON.stringify(executeQuery) ,
            {headers: {'Content-Type': 'application/json'}}
        );
        res.data["way"]=way;
        console.log(res.data);
        yield put({
            type: TenantAppModule.GET_LIST_SUCCESS,
            datas: res.data,
            receivedAt: Date.now(),
        });
    } catch (e) {
        yield put({
            type: TenantAppModule.GET_LIST_FAILURE,
            e,
        });
    }
}
export default handleRequestList;