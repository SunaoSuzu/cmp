import { putRequest} from '../../util/Common';
import {ON_SUCCESS_UPDATE,ERROR} from "../modules";
import { getContext } from 'redux-saga/effects';

const base = "https://a88ytp7kbf.execute-api.ap-northeast-1.amazonaws.com";

export default function* update(action) {
    const db = yield getContext("db");
    const url = base + "/" + db.database + "/" + db.table + "/" + action.payload.id
    yield putRequest({
        url: url,
        data : action.payload,
        onSuccess: ON_SUCCESS_UPDATE,
        onError: ERROR,
    });
}
