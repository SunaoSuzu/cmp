import {GET_ES_LIST} from "./index";
import {GET_LIST, ON_SUCCESS_GET_LIST, ON_SUCCESS_ADD, ON_SUCCESS_UPDATE,ON_SUCCESS_GET_ES_LIST, ON_SUCCESS_SEARCH} from "../../common/modules"


const initialState = {
    cache      : null,
    cacheTotal : 0,

    total   : 0,
    list    :[]
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ON_SUCCESS_GET_LIST:
            return {list : action.payload ,total : state.cacheTotal, cacheTotal:null, cache :null};
        case ON_SUCCESS_GET_ES_LIST:
        case ON_SUCCESS_SEARCH:
            const hits  = action.payload.hits.hits.map(hit => {
                hit._source.highlight=hit.highlight;
                return hit._source;
            });
            const t = action.payload.hits.total
            if(action.type===ON_SUCCESS_GET_ES_LIST){
                return {...state ,  list : hits ,total : t , cacheTotal: t};
            }else{
                return {...state ,  list : hits ,total : t };
            }
        case ON_SUCCESS_ADD:
            return {...state , cache : action.payload , cacheTotal : state.cacheTotal + 1}
        case ON_SUCCESS_UPDATE:
            return {...state , cache : action.updated}
        default :
            return state;
    }
}
export function getList(keyword,from , size) {
    return { type: GET_LIST , payload : {from : from , size : size ,keyword : keyword }};
}
export function getESList(keyword,from , size) {
    return { type: GET_ES_LIST , payload : {from : from , size : size ,keyword : keyword }};
}
