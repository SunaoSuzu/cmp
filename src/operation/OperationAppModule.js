export const GET_OPERATION = "GET_OPERATION";
export const ON_SUCCESS_GET_OPERATION = "ON_SUCCESS_GET_OPERATION";

const initialState = {
    blocking:  false,
    operations : [],
}


export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_OPERATION:
            return {...state , blocking : true };
        case ON_SUCCESS_GET_OPERATION:
            return {...state , operations : action.payload , blocking : false};
        default:
            return state;
    }
}

export function getOperation(){
    return {
        type : GET_OPERATION,
    };
}