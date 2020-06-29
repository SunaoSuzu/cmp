import { putRequest} from '../../../platform/util/Common';
import {ON_SUCCESS_UPDATE,ERROR} from "../modules";
import { getContext } from 'redux-saga/effects';

const base = process.env.REACT_APP_DEV_PLATFORM + "/data";

export default function* update(action) {
    const db = yield getContext("db");
    const url = base + "/" + db.database + "/" + db.table + "/" + action.payload.id
    yield putRequest({
        url: url,
        token : yield getContext("token"),
        data : action.payload,
        onSuccess: ON_SUCCESS_UPDATE,
        onError: ERROR,
    });
}
