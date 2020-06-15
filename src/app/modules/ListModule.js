import {GET_LIST,ON_SUCCESS_GET_LIST} from "./index";

const initialState = {
    list: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ON_SUCCESS_GET_LIST:
            return { list : action.payload};
        default :
            return state;
    }
}
export function getList(keyword,from , size) {
    return { type: GET_LIST , from : from , size : size ,keyword : keyword };
}
