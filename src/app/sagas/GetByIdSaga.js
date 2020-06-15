import {getRequest} from '../../util/Common';
import {ON_SUCCESS_GET_BY_ID,ERROR} from "../modules";
import { getContext } from 'redux-saga/effects';

const base = "https://a88ytp7kbf.execute-api.ap-northeast-1.amazonaws.com";

export default function* getById(action) {
    const db = yield getContext("db");
    const url = base + "/" + db.database + "/" + db.table + "/" + action.payload
    yield getRequest({
        url: url,
        onSuccess: ON_SUCCESS_GET_BY_ID,
        onError: ERROR,
    });
}
