export const START_MONITORING = "START_MONITORING";
export const GET_OPERATION = "GET_OPERATION";
export const ON_SUCCESS_GET_OPERATION = "ON_SUCCESS_GET_OPERATION";
export const DATA_UPDATED = "DATA_UPDATED";
export const STOP_MONITORING = "STOP_MONITORING";


const initialState = {
    blocking:  false,
    operations : [],
}


export default function reducer(state = initialState, action) {
    switch (action.type) {
        case START_MONITORING:
            return {operations : [] , blocking : true}; //便宜上毎回空
        case DATA_UPDATED:
            return {operations : action.payload , blocking : false};
        default:
            return state;
    }
}

export function startMonitoring(){
    return {
        type : START_MONITORING,
    };
}

export function stopMonitoring(){
    return {
        type : STOP_MONITORING,
    };
}
