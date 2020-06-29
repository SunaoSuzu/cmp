import {setProperty,getProperty} from "../../../platform/util/JsonUtils";
import {CHANGE_PROPERTY_ADD,ON_SUCCESS_INIT_ADD,INIT_ADD,ADD_CHILD,MOD_CHILD,DEL_CHILD} from "./index";
import {ADD} from "../../common/modules"

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
        case ADD_CHILD:{
            const data  = {...state.data};
            const array = getProperty(data,action.payload.name)
            setProperty(data, action.payload.name, array.concat(action.payload.newValue));
            console.log("ADD_CHILD:" + JSON.stringify(action.payload.newValue));
            return { data: data }
        }
        case MOD_CHILD:{
            const index = getProperty(state.data,action.payload.name).indexOf(action.payload.oldValue);
            const data = {...state.data};
            const array = getProperty(data,action.payload.name);
            array[index]=action.payload.newValue
            return { data: data }
        }
        case DEL_CHILD:{
            const index = getProperty(state.data,action.payload.name).indexOf(action.payload.oldValue);
            const data = {...state.data};
            const array = getProperty(data,action.payload.name);
            array.splice(index,1);
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

export function addChild(name, newValue) {
    return { type: ADD_CHILD, payload: { name, newValue } };
}

export function modChild(name, newValue , oldValue) {
    return { type: MOD_CHILD, payload: { name, newValue , oldValue } };
}

export function delChild(name,  oldValue) {
    return { type: DEL_CHILD, payload: { name,  oldValue } };
}
