import * as types from "./index"
import * as common from "../../common/modules"

const initialState = {
    blocking : false,
    error    : false,
    redirect : false,
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case common.ON_SUCCESS_GET_LIST:
        case common.ON_SUCCESS_SEARCH:
        case common.ON_SUCCESS_GET_ES_LIST:
        case types.ON_SUCCESS_GET_BY_ID:
            return {...state , blocking: false ,redirect : false}
        case common.ON_SUCCESS_UPDATE:
        case common.ON_SUCCESS_ADD:{
            return {...state , redirect : true, blocking: false}
        }
        case common.GET_LIST:
        case types.GET_ES_LIST:
        case types.GET_BY_ID:
        case common.UPDATE:
        case common.ADD:
            return {...state , blocking: true , redirect : false}
        case common.ERROR:
            console.log("ERROR:" + JSON.stringify(action.error))
            return {...state , blocking: false , redirect : false}
        default :
            return state;
    }
}