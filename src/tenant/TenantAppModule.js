import axios from 'axios'

export const GET_LIST_REQUEST = 2;
export const GET_LIST_SUCCESS = 3;
export const GET_LIST_FAILURE = 4;


export const GOTO_DETAIL = 10;
export const GET_DETAIL_REQUEST = 11;
export const GET_DETAIL_SUCCESS = 12;
export const GET_DETAIL_FAILURE = 19;


export const CHANGE_PROPERTY = 30;
export const UPDATE_REQUEST = 100;
export const UPDATE_SUCCESS = 110;
export const UPDATE_FAILURE = 120;

export const GOTO_ADD = 5;
export const CHANGE_PROPERTY_OF_NEW = 55;
export const ADD_REQUEST = 56;
export const ADD_SUCCESS = 57;
export const ADD_FAILURE = 59;


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
const empty = {
    "name": null,
    "statusCaption": "本番運用中",
    "environmentSetting": {
        "vpcType": 1
    },
    "contract": {
        "infraAnnualIncome": null ,
        "details": [
            {},
        ],
        "remarks": null
    },
    "environments": []

};

const baseEndPoint = "http://localhost:3011";


const initialState = {
    operationType : GET_LIST_REQUEST, // 不要な予感。。（もしくは選択肢が多すぎるし、Restなんだからずれそう）
    breadcrumbStack : [],
    isFetching: false,
    datas : [],

    data  : {},
    getDetailComplete : yet,
    updateComplete: noNeed,


    newData  : {},
    addComplete: noNeed,
};

const breadcrumbStackList = { caption : "テナント一覧" , to : "/tenant/list"};

export default function reducer(state=initialState, action) {
    console.log(action.type);
    switch (action.type) {
        case GET_LIST_REQUEST:
            return {...state , operationType : GET_LIST_SUCCESS,isFetching : true,breadcrumbStack:[]  };
        case GET_LIST_SUCCESS:
            return {...state , operationType : GET_LIST_SUCCESS,isFetching : false  , datas : action.datas};
        case GET_LIST_FAILURE:
            return {...state , operationType : GET_LIST_SUCCESS , isFetching : false  , datas : []};//どうするのが正しいか未定
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
            return {...state , newData : obj ,addComplete:necessary };
        case ADD_REQUEST:
            return {...state , operationType : ADD_REQUEST, addComplete : syncing};
        case ADD_SUCCESS:
            console.log("added " + JSON.stringify(action.data));
            return {...state , operationType : ADD_SUCCESS, addComplete : synced, newData : action.data};
        case ADD_FAILURE:
            return {...state , operationType : ADD_FAILURE, addComplete : failed};

        default:
                return state
    }
};

function setProperty(obj , path , value){
    const paths = path.split(".");
    let base = obj;
    paths.forEach(function(path, index){
        if( index === (paths.length - 1) ){
            base[path]=value;
        }else{
            base = base[path];
        }
    });

}
// Action Creators

const getListRequest = () => {
    return {
        type: GET_LIST_REQUEST
    }
};

const getListSuccess = (json) => {
    return {
        type: GET_LIST_SUCCESS,
        datas : json,
        receivedAt: Date.now()
    }
};

const getListFailure = (error) => {
    return {
        type: GET_LIST_FAILURE,
        error
    }
};

export const selectList  = () => {
    return (dispatch) => {
        dispatch(getListRequest());
        return axios.get(baseEndPoint + `/tenant`)
            .then(res =>
                dispatch(getListSuccess(res.data))
            ).catch(err =>
                dispatch(getListFailure(err))
            )
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

export const loadDetail=(id) => {
    return (dispatch) => {
        dispatch(requestLoadDetail(id));
        console.log("get:" + id);
        return axios.get(baseEndPoint + `/tenant/` + id)
            .then(res =>
                dispatch(successLoadDetail(res.data))
            ).catch(err =>
                dispatch(failLoadDetail(err))
            )
    }
};

export const requestLoadDetail=(id) => {
    return {
        type: GET_DETAIL_REQUEST,
        id: id,
    }
};

export const successLoadDetail = (data) => {
    return {
        type: GET_DETAIL_SUCCESS,
        data: data
    }
};

const failLoadDetail = (error) => {
    return {
        type: GET_LIST_FAILURE,
        error
    }
};

export const changeProperty  = (e) => {
    return {
        type: CHANGE_PROPERTY,
        name: e.target.name,
        value: e.target.value
    }
};

export const updateData  = (data) => {
    return (dispatch) => {
        dispatch(startUpdate(data));
        console.log("send:" + data);
        return axios.put(baseEndPoint + `/tenant/` + data.id , data)
            .then(res =>
                dispatch(updateSuccess(res.data))
            ).catch(err =>
                dispatch(updateFail(err))
            )
    }
};

export const startUpdate = (data) => {
    return {
        type: UPDATE_REQUEST,
        data: data
    }
};

export const updateSuccess = (data) => {
    return {
        type: UPDATE_SUCCESS,
        data: data
    }
};

export const updateFail = (error) => {
    return {
        type: UPDATE_FAILURE,
        error
    }
};

export const changePropertyOfNew  = (e) => {
    return {
        type: CHANGE_PROPERTY_OF_NEW,
        name: e.target.name,
        value: e.target.value
    }
};

export const addData  = (data) => {
    return (dispatch) => {
        dispatch(startAdd(data));
        console.log("send add:" + data);
        return axios.post(baseEndPoint + `/tenant/tenant` , data)
            .then(res =>
                dispatch(addSuccess(res.data))
            ).catch(err =>
                dispatch(addFail(err))
            )
    }
};

export const startAdd = (data) => {
    return {
        type: ADD_REQUEST,
        data: data
    }
};

export const addSuccess = (data) => {
    return {
        type:ADD_SUCCESS,
        data: data
    }
};

export const addFail = (error) => {
    return {
        type: ADD_FAILURE,
        error
    }
};
