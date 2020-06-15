import * as types from "./index"

const initialState = {
    blocking : false,
    error    : false,
    redirect : false,
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case types.ON_SUCCESS_GET_LIST:
        case types.ON_SUCCESS_GET_BY_ID:
            return {...state , blocking: false ,redirect : false}
        case types.ON_SUCCESS_UPDATE:
        case types.ON_SUCCESS_ADD:{
            return {...state , redirect : true}
        }
        case types.GET_LIST:
        case types.GET_BY_ID:
        case types.UPDATE:
        case types.ADD:
            return {...state , blocking: true , redirect : false}
        default :
            return state;
    }
}