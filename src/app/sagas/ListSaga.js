import {getRequest} from '../../util/Common';
import {ON_SUCCESS_GET_LIST,ERROR} from "../modules";
import { getContext } from 'redux-saga/effects';

const base = "https://a88ytp7kbf.execute-api.ap-northeast-1.amazonaws.com";

export default function* list() {
    const db = yield getContext("db");
    const url = base + "/" + db.database + "/" + db.table
    yield getRequest({
        url: url,
        onSuccess: ON_SUCCESS_GET_LIST,
        onError: ERROR,
    });
}
