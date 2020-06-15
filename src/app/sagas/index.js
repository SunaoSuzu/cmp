import { all, takeEvery, takeLatest } from "redux-saga/effects";
import {ADD,GET_LIST,GET_BY_ID,UPDATE} from "../modules";
import add from "./AddSaga"
import search from "./SearchSaga"
import getById from "./GetByIdSaga"
import update from "./UpdateSaga"

export default function* rootSaga() {
    all(
        yield takeEvery(ADD, add),
        yield takeEvery(GET_LIST, search),
        yield takeEvery(GET_BY_ID, getById),
        yield takeEvery(UPDATE, update),
    )
}
