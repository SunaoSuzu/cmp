import { all, takeEvery, takeLatest } from "redux-saga/effects";
import {INIT_ADD,GET_ES_LIST,GET_BY_ID,INIT_PROFILE} from "../modules";
import {ADD,GET_LIST,UPDATE} from "../../common/modules";

import add from "../../common/sagas/AddSaga"
import search from "../../common/sagas/SearchSaga"
import list   from "../../common/sagas/ListSaga"
import getById from "./GetByIdSaga"
import update from "../../common/sagas/UpdateSaga"
import initAdd from "./InitAddSaga"
import initProfile from "./InitModSaga"

export default function* rootSaga() {
    all(
        yield takeEvery(INIT_ADD, initAdd),
        yield takeEvery(ADD, add),
        yield takeLatest(GET_ES_LIST, search),
        yield takeLatest(GET_LIST, list),
        yield takeEvery(INIT_PROFILE, initProfile),
        yield takeEvery(GET_BY_ID, getById),
        yield takeEvery(UPDATE, update),
    )
}
