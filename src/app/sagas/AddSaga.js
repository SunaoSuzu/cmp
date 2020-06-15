import { postRequest} from '../../util/Common';
import {ON_SUCCESS_ADD,ERROR} from "../modules";
import { getContext } from 'redux-saga/effects';

const base = "https://a88ytp7kbf.execute-api.ap-northeast-1.amazonaws.com";

export default function* addTodo(action) {
    const db = yield getContext("db");
    const url = base + "/" + db.database + "/" + db.table
    yield postRequest({
        url: url,
        data : action.payload,
        onSuccess: ON_SUCCESS_ADD,
        onError: ERROR,
    });
}
