import { postRequest} from '../../util/Common';
import {ON_SUCCESS_ADD,ERROR} from "../modules";
import { getContext } from 'redux-saga/effects';

const base = process.env.REACT_APP_DEV_PLATFORM + "/data";

export default function* add(action) {
    const db = yield getContext("db");
    const token = yield getContext("token");
    const url = base + "/" + db.database + "/" + db.table
    yield postRequest({
        url: url,
        data : action.payload,
        token : token,
        onSuccess: ON_SUCCESS_ADD,
        onError: ERROR,
    });
}
