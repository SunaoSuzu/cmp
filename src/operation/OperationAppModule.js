import {ON_SUCCESS_GET_STATUS} from "../NavigationModule";


export const GET_OPERATION = "GET_OPERATION";
export const ON_SUCCESS_GET_OPERATION = "ON_SUCCESS_GET_OPERATION";

const initialState = {
    operations : [],
}


export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ON_SUCCESS_GET_OPERATION:
            return {...state , operations : action.payload };
        default:
            return state;
    }
}

export function getOperation(){
    return {
        type : GET_OPERATION,
    };
}