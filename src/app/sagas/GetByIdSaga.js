import {getRequest} from '../../util/Common';
import {ON_SUCCESS_GET_BY_ID,ERROR} from "../modules";
import { getContext } from 'redux-saga/effects';

const base = process.env.REACT_APP_DEV_PLATFORM + "/data";

export default function* getById(action) {
    const db = yield getContext("db");
    const url = base + "/" + db.database + "/" + db.table + "/" + action.payload
    yield getRequest({
        url: url,
        token : yield getContext("token"),
        onSuccess: ON_SUCCESS_GET_BY_ID,
        onError: ERROR,
    });
}
