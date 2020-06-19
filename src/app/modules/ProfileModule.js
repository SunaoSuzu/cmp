import {setProperty} from "../../util/JsonUtils";
import {CHANGE_PROPERTY_UPDATE,UPDATE,GET_BY_ID,ON_SUCCESS_GET_BY_ID,ON_SUCCESS_UPDATE,INIT_PROFILE,ON_SUCCESS_INIT_PROFILE} from "./index";


const initialState = {
    data : {},
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ON_SUCCESS_INIT_PROFILE:{
            return {data : action.payload};
        }
        case CHANGE_PROPERTY_UPDATE:{
            const data = {...state.data};
            setProperty(data, action.payload.name, action.payload.value);
            return { data: data }
        }
        case ON_SUCCESS_UPDATE:
        case ON_SUCCESS_GET_BY_ID:{
            return { data: action.payload }
        }
        default:
            return state;
    }
}

export function initProfile(id) {
    return { type: INIT_PROFILE, payload: id };
}

export function getBiId(id) {
    return { type: GET_BY_ID, payload: id };
}

export function update(data) {
    return { type: UPDATE, payload: data };
}

export function changeProperty(name, value) {
    return { type: CHANGE_PROPERTY_UPDATE, payload: { name: name, value: value } };
}
