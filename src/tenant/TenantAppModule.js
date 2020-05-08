import { setProperty , pushEmptyToArray , spliceObjOfArray } from "../util/JsonUtils";

export const GET_LIST_REQUEST = "GET_LIST_REQUEST";
export const GET_LIST_SUCCESS = "GET_LIST_SUCCESS";
export const GET_LIST_FAILURE = "GET_LIST_FAILURE";


export const GOTO_DETAIL = "GOTO_DETAIL";
export const GET_DETAIL_REQUEST = "GET_DETAIL_REQUEST";
export const GET_DETAIL_SUCCESS = "GET_DETAIL_SUCCESS";
export const GET_DETAIL_FAILURE = "GET_DETAIL_FAILURE";


export const CHANGE_PROPERTY = "CHANGE_PROPERTY";
export const UPDATE_REQUEST = "UPDATE_REQUEST";
export const UPDATE_SUCCESS = "UPDATE_SUCCESS";
export const UPDATE_FAILURE = "UPDATE_FAILURE";

export const GOTO_ADD = "GOTO_ADD";
export const CHANGE_PROPERTY_OF_NEW = "CHANGE_PROPERTY_OF_NEW";
export const ADD_REQUEST = "ADD_REQUEST";
export const ADD_SUCCESS = "ADD_SUCCESS";
export const ADD_FAILURE = "ADD_FAILURE";

export const DEL_REQUEST = "DEL_REQUEST";
export const DEL_SUCCESS = "DEL_SUCCESS";
export const DEL_FAILURE = "DEL_FAILURE";


//
export const PUSH_EMPTY_TO_ARRAY = "PUSH_EMPTY_TO_ARRAY";
export const PUSH_EMPTY_TO_ARRAY_NEW = "PUSH_EMPTY_TO_ARRAY_NEW";
export const DEL_FROM_ARRAY = "DEL_FROM_ARRAY";
export const DEL_FROM_ARRAY_NEW = "DEL_FROM_ARRAY_NEW";


export const noNeed = 1;
export const necessary = 2;
export const syncing = 3;
export const synced = 4;
export const failed = 9;

export const yet = 1;
export const requested = 2;
export const loadSuccess = 3;
export const loadFailed = 9;

// for new add
export const empty_contract = {"productMstId" : "" , amount : ""};


export const empty = {
    "name": "",
    "alias": "",
    "statusCaption": "本番運用中",
    "tags" : [{}],
    "environmentSetting": {
        "vpcType": 1
    },
    "contract": {
        "infraAnnualIncome": "" ,
        "details": [
            empty_contract,
        ],
        "remarks": ""
    },
    "environments": []
};

const initialState = {
    operationType : GET_LIST_REQUEST, // 不要な予感。。（もしくは選択肢が多すぎるし、Restなんだからずれそう）
    breadcrumbStack : [],

    loadSuccess : yet,
    datas : [],

    data  : {},
    getDetailComplete : yet,
    updateComplete: noNeed,


    newData  : {},
    addComplete: noNeed,

    deleteComplete : yet,
};

const breadcrumbStackList = { caption : "テナント一覧" , to : "/tenant/list"};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case GET_LIST_REQUEST:
            return {...state , operationType : GET_LIST_SUCCESS,loadSuccess : requested , breadcrumbStack:[]  };
        case GET_LIST_SUCCESS:
            return {...state , operationType : GET_LIST_SUCCESS,loadSuccess : loadSuccess , datas : action.datas};
        case GET_LIST_FAILURE:
            return {...state , operationType : GET_LIST_SUCCESS ,loadSuccess : loadFailed, datas : []};//どうするのが正しいか未定
        case GOTO_DETAIL:
            return {...state , operationType : GOTO_DETAIL , data : null ,getDetailComplete :yet};
        case GET_DETAIL_REQUEST:
            return {...state , operationType : GET_DETAIL_REQUEST, getDetailComplete :requested};
        case GET_DETAIL_SUCCESS:
            return {...state , operationType : GET_DETAIL_SUCCESS, data : action.data,getDetailComplete :loadSuccess ,updateComplete:noNeed ,breadcrumbStack : [breadcrumbStackList]};
        case GET_DETAIL_FAILURE:
            return {...state , operationType : GET_DETAIL_FAILURE, data : null ,getDetailComplete :loadFailed }; //どうするのが正しいか未定
        case CHANGE_PROPERTY:
            const newData = {...state.data};
            setProperty(newData , action.name , action.value);
            return {...state , data : newData,updateComplete:necessary };
        case UPDATE_REQUEST:
            return {...state , operationType : UPDATE_REQUEST, updateComplete : syncing};
        case UPDATE_SUCCESS:
            return {...state , operationType : UPDATE_SUCCESS, updateComplete : synced};
        case UPDATE_FAILURE:
            return {...state , operationType : UPDATE_FAILURE, updateComplete : failed};
        case GOTO_ADD:
            return {...state , operationType : GOTO_ADD ,  newData : empty, addComplete : noNeed ,breadcrumbStack : [breadcrumbStackList]};
        case CHANGE_PROPERTY_OF_NEW:
            const obj = {...state.newData};
            setProperty(obj , action.name , action.value);
            console.log("newData=" + JSON.stringify(obj));
            return {...state , newData : obj ,addComplete:necessary };
        case ADD_REQUEST:
            return {...state , operationType : ADD_REQUEST, addComplete : syncing};
        case ADD_SUCCESS:
            return {...state , operationType : ADD_SUCCESS, addComplete : synced, newData : action.data};
        case ADD_FAILURE:
            return {...state , operationType : ADD_FAILURE, addComplete : failed};
        case DEL_REQUEST:
            return {...state , operationType : DEL_REQUEST, delComplete : syncing};
        case DEL_SUCCESS:
            return {...state , operationType : DEL_SUCCESS, delComplete : synced, loadSuccess: yet , datas : null};
        case DEL_FAILURE:
            return {...state , operationType : DEL_FAILURE, delComplete : failed};
            //ここから先は細かい処理
        case PUSH_EMPTY_TO_ARRAY_NEW:
            return {...state , operationType : PUSH_EMPTY_TO_ARRAY_NEW,
                newData : pushEmptyToArray({...state.newData} , action.path,action.empty)
                ,addComplete:necessary};
        case PUSH_EMPTY_TO_ARRAY:
            return {...state , operationType : PUSH_EMPTY_TO_ARRAY,
                newData : pushEmptyToArray({...state.data} , action.path,action.empty)
                ,addComplete:necessary};
        case DEL_FROM_ARRAY_NEW:
            return {...state , operationType : DEL_FROM_ARRAY_NEW,
                newData : spliceObjOfArray({...state.newData} , action.path , action.index)
                ,addComplete:necessary};
        case DEL_FROM_ARRAY:
            return {...state , operationType : DEL_FROM_ARRAY,
                newData : spliceObjOfArray({...state.data} , action.path , action.index)
                ,addComplete:necessary};
        default:
                return state
    }
};

// Action Creators

export const requestList = () => {
    return {
        type: GET_LIST_REQUEST
    }
};

export const selectGoToAdd  = () => {
    return {
        type: GOTO_ADD,
    }
};

export const selectGoToDetail  = (data) => {
    return {
        type: GOTO_DETAIL,
        data: data
    }
};

export const requestLoadDetail=(id) => {
    return {
        type: GET_DETAIL_REQUEST,
        id: id,
    }
};


export const changeProperty  = (e) => {
    return {
        type: CHANGE_PROPERTY,
        name: e.target.name,
        value: e.target.value
    }
};

export const changePropertyOfNew  = (e) => {
    return {
        type: CHANGE_PROPERTY_OF_NEW,
        name: e.target.name,
        value: e.target.value
    }
};

export const requestUpdate = (data) => {
    return {
        type: UPDATE_REQUEST,
        data: data
    }
};

export const requestAdd = (data) => {
    return {
        type: ADD_REQUEST,
        data: data
    }
};

export const requestDel = (id) => {
    return {
        type: DEL_REQUEST,
        id: id
    }
};

//
export const pushEmptyForNew = (path,empty) => {
    return {
        type: PUSH_EMPTY_TO_ARRAY_NEW,
        path: path,
        empty: empty
    }
}

export const pushEmpty = (path,empty) => {
    return {
        type: PUSH_EMPTY_TO_ARRAY,
        path: path,
        empty: empty
    }
}

export const delFromArrayForNew = (path,index) => {
    return {
        type:  DEL_FROM_ARRAY_NEW,
        path:  path,
        index: index,
    }
}

export const delFromArray = (path,index) => {
    return {
        type:   DEL_FROM_ARRAY,
        path:   path,
        index : index,
    }
}