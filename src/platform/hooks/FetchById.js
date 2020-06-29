import { useEffect, useReducer } from 'react';
import {useIdToken} from "../UserContextProvider"

const initialState = {
    loading: false, // データ取得中はtrueに設定される
    error: null,    // データ取得でエラーになると設定される
    data: null,     // データ取得結果が設定される
};

const base = process.env.REACT_APP_DEV_PLATFORM + "/data";

const reducer = (state, action) => {
    switch (action.type) {
        case 'init': // 初期状態に戻す
            return initialState;
        case 'start': // データ取得を開始する
            return { ...state, loading: true };
        case 'data': // データ取得が正常終了する
            return { ...state, loading: false, data: action.data };
        case 'error': // データ取得がエラー終了する
            return { ...state, loading: false, error: action.error };
        default: // それ以外は起こりえないのでバグ検知のためthrow
            throw new Error('no such action type');
    }
};

const defaultReadBody = body => body.json(); // デフォルトではjsonとしてparseする

export const useFetchById = (
    db,
    table,
    id ,
    reload =0 ,
    readBody = defaultReadBody,
) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const token = useIdToken();
    useEffect(() => {
        let dispatchSafe = action => dispatch(action); // cleanupで無効にするため
        const abortController = new AbortController(); // cleanupでabortするため
        const url = base + "/" + db + "/" + table + "/" + id;
        (async () => {
            if (!url) return;
            dispatchSafe({ type: 'start' });
            try {
                const response = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "Authorization": `${token}`,
                    },
                    signal: abortController.signal,
                });
                if (response.ok) {
                    const body = await readBody(response);
                    dispatchSafe({ type: 'data', data: body });
                } else {
                    const e = new Error(`Fetch failed: ${response.statusText}`);
                    dispatchSafe({ type: 'error', error: e });
                }
            } catch (e) {
                dispatchSafe({ type: 'error', error: e });
            }
        })();
        const cleanup = () => {
            dispatchSafe = () => null; // we should not dispatch after unmounted.
            abortController.abort();
            dispatch({ type: 'init' });
        };
        return cleanup;
    }, [db, table, id]);
    return state;
};
