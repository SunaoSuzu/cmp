import { all, takeEvery, takeLatest } from "redux-saga/effects";
import {INIT_ADD,ADD,GET_ES_LIST,GET_LIST,GET_BY_ID,UPDATE,INIT_PROFILE} from "../modules";
import add from "./AddSaga"
import search from "./SearchSaga"
import list   from "./ListSaga"
import getById from "./GetByIdSaga"
import update from "./UpdateSaga"
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
