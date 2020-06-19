import {getRequest} from '../../util/Common';
import {ON_SUCCESS_GET_LIST,ERROR} from "../modules";
import { getContext } from 'redux-saga/effects';

const base = process.env.REACT_APP_DEV_PLATFORM + "/data";

export default function* list(action) {
    const db = yield getContext("db");
    const url = base + "/" + db.database + "/" + db.table + "?forward=false&limit=" + action.size;
    yield getRequest({
        url: url,
        token : yield getContext("token"),
        onSuccess: ON_SUCCESS_GET_LIST,
        onError: ERROR,
    });
}
