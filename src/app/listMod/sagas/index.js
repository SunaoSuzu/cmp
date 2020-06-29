import { all, takeEvery, takeLatest } from "redux-saga/effects";
import {ADD,GET_LIST,UPDATE} from "../../common/modules";

import add from "../../common/sagas/AddSaga"
import list   from "../../common/sagas/ListSaga"
import update from "../../common/sagas/UpdateSaga"

export default function* rootSaga() {
    all(
        yield takeEvery(ADD, add),
        yield takeLatest(GET_LIST, list),
        yield takeEvery(UPDATE, update),
    )
}
