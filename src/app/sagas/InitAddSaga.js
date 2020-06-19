import {getContext , put} from "redux-saga/effects";
import {ON_SUCCESS_INIT_ADD} from "../modules";

export default function* initAdd(action) {
    const schema = yield getContext("schema");
    const initial = {}
    schema.fields.forEach( field => (initial[field.name]=""))
    yield put({
        type: ON_SUCCESS_INIT_ADD,
        payload : initial,
    });
}