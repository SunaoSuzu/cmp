import {getContext , put} from "redux-saga/effects";
import {ON_SUCCESS_INIT_PROFILE} from "../modules";

//今はaddと全く一緒だけどいずれ変わる想定
export default function* initMod(action) {
    const initialDef = yield getContext("initial");
    const initial = {...initialDef}
    yield put({
        type: ON_SUCCESS_INIT_PROFILE,
        payload : initial,
    });
}