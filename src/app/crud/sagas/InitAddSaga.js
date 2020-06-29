import {getContext , put} from "redux-saga/effects";
import {ON_SUCCESS_INIT_ADD} from "../modules";

export default function* initAdd(action) {
    const initialDef = yield getContext("initial");
    const initial = {...initialDef}
    yield put({
        type: ON_SUCCESS_INIT_ADD,
        payload : initial,
    });
}