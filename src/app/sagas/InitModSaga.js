import {getContext , put} from "redux-saga/effects";
import {ON_SUCCESS_INIT_PROFILE} from "../modules";

export default function* initMod(action) {
    const schema = yield getContext("schema");
    const initial = {}
    schema.fields.forEach( field => (initial[field.field]=""))
    yield put({
        type: ON_SUCCESS_INIT_PROFILE,
        payload : initial,
    });
}