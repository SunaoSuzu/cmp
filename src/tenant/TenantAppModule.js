import axios from 'axios'

export const GET_LIST_REQUEST = 2;
export const GET_LIST_SUCCESS = 3;
export const GET_LIST_FAILURE = 4;
export const GOTO_ADD = 5;
export const GOTO_DETAIL = 10;
export const CHANGE_PROPERTY = 30;


export const UPDATE_REQUEST = 100;
export const UPDATE_SUCCESS = 110;
export const UPDATE_FAILURE = 120;


export const noNeed = 1;
export const necessary = 2;
export const syncing = 3;
export const synced = 4;
export const failed = 9;


const initialState = {
    isFetching: false,
    updateComplete: noNeed,
    operationType : GET_LIST_REQUEST,
    datas : [],
    data  : {},
    breadcrumbStack : [],
};

const breadcrumbStackList = { caption : "テナント一覧" , to : "/tenant/list"};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case GET_LIST_REQUEST:
            return {...state, operationType : GET_LIST_SUCCESS,isFetching : true,breadcrumbStack:[]  };
        case GET_LIST_SUCCESS:
            return {...state, operationType : GET_LIST_SUCCESS,isFetching : false  , datas : action.datas};
        case GET_LIST_FAILURE:
            return {...state, operationType : GET_LIST_SUCCESS , isFetching : false  , datas : []};
        case GOTO_ADD:
            return {...state, operationType : GOTO_ADD ,  data : null, breadcrumbStack : [breadcrumbStackList]};
        case GOTO_DETAIL:
            return {...state, data : action.data,updateComplete:noNeed ,breadcrumbStack : [breadcrumbStackList]};
        case CHANGE_PROPERTY:
            const newData = {...state.data};
            const paths = action.name.split(".");
            let base = newData;
            paths.forEach(function(path, index){
                if( index === (paths.length - 1) ){
                    base[path]=action.value;
                }else{
                    base = base[path];
                }
            });
            return {...state, data : newData,updateComplete:necessary };
        case UPDATE_REQUEST:
            console.log("UPDATE_REQUEST " + JSON.stringify(action.data));
            return {...state, operationType : UPDATE_REQUEST, updateComplete : syncing};
        case UPDATE_SUCCESS:
            console.log("UPDATE_SUCCESS " + JSON.stringify(action.data));
            return {...state, operationType : UPDATE_SUCCESS, updateComplete : synced};
        case UPDATE_FAILURE:
            console.log("UPDATE_FAILURE " + JSON.stringify(action.data));
            return {...state, operationType : UPDATE_FAILURE, updateComplete : failed};
        default:
                return state
    }
};

// Action Creators

const getPostsRequest = () => {
    return {
        type: GET_LIST_REQUEST
    }
};

const getPostsSuccess = (json) => {
    return {
        type: GET_LIST_SUCCESS,
        datas : json,
        receivedAt: Date.now()
    }
};

const getPostsFailure = (error) => {
    return {
        type: GET_LIST_FAILURE,
        error
    }
};

export const selectList  = () => {
    return (dispatch) => {
        dispatch(getPostsRequest());
        return axios.get(`http://localhost:3011/tenant`)
            .then(res =>
                dispatch(getPostsSuccess(res.data))
            ).catch(err =>
                dispatch(getPostsFailure(err))
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
        return axios.put(`http://localhost:3011/tenant/` + data.id , data)
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
