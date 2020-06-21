import * as types from "./index"
import {ON_SUCCESS_ADD, ON_SUCCESS_GET_LIST, ON_SUCCESS_UPDATE} from "./index";


const initialState = {
    list    :[]
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ON_SUCCESS_GET_LIST:
            return {list : action.payload};
        case ON_SUCCESS_ADD:
            return {list : state.list.concat(action.payload)};
        case ON_SUCCESS_UPDATE:{
            const newList = [...state.list];
            const index = state.list.findIndex( d => (d.id === action.payload.id))
            newList[index]=action.payload;
            return {list : newList};
        }
        default :
            return state;
    }
}
export function getList() {
    return { type: types.GET_LIST , payload : { from : 0 , size : 1000 ,keyword : "" } };
}
