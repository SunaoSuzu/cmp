import {setProperty} from "../../util/JsonUtils";
import {CHANGE_PROPERTY_ADD,ADD,ON_SUCCESS_INIT_ADD,INIT_ADD} from "./index";


const initialState = {
    data : {},
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ON_SUCCESS_INIT_ADD:{
            return { data: action.payload }
        }
        case CHANGE_PROPERTY_ADD:{
            const data = {...state.data};
            setProperty(data, action.payload.name, action.payload.value);
            return { data: data }
        }
        default:
            return state;
    }
}

export function initAdd() {
    return { type: INIT_ADD };
}

export function add(data) {
    return { type: ADD, payload: data };
}

export function changeProperty(name, value) {
    return { type: CHANGE_PROPERTY_ADD, payload: { name: name, value: value } };
}
