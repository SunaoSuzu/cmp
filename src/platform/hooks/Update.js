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
            console.log("REDUCER:data")
            return { ...state, loading: false, data: action.data };
        case 'error': // データ取得がエラー終了する
            return { ...state, loading: false, error: action.error };
        default: // それ以外は起こりえないのでバグ検知のためthrow
            throw new Error('no such action type');
    }
};


export const useUpdate = (
    db,
    table,
    id,
) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const token = useIdToken();
    const url = base + "/" + db + "/" + table + "/" +id;

    const handler = async function (data) {
        if (!url) return;
        dispatch({ type: 'start' });
        try {
            fetch(url, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": `${token}`,
                },
            }).then(response => response.json()
            ).then(response => {
                console.log("成功:" + JSON.stringify(response));
                dispatch({ type: 'data', data: response })
                return state;
            }).catch(response => {
                console.log("エラー:" + JSON.stringify(response));
                dispatch({ type: 'error', error: response.statusText })
                return state;
            });
        } catch (e) {
            dispatch({ type: 'error', error: e });
            return state;
        }
        return state;
    }
    return {handler,...state};
};
