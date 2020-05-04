import axios from 'axios'

export const GET_LIST_REQUEST = 2;
export const GET_LIST_SUCCESS = 3;
export const GET_LIST_FAILURE = 4;
export const GOTO_ADD = 5;
export const GOTO_DETAIL = 10;
export const UPDATE_DATA = 100;



const initialState = {
    isFetching: false,
    operationType : GET_LIST_REQUEST,
    datas : [],
    data  : {},
    breadcrumbStack : [],
};

const breadcrumbStackList = { caption : "テナント一覧" , to : "/tenant/list"};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case GET_LIST_REQUEST:
            return {isFetching : true , operationType : GET_LIST_SUCCESS , datas : [] , data : null ,
                breadcrumbStack : []};

        case GET_LIST_SUCCESS:
            return {isFetching : false , operationType : GET_LIST_SUCCESS , datas : action.datas , data : null ,
                breadcrumbStack : []};
        case GET_LIST_FAILURE:
            return {isFetching : false , operationType : GET_LIST_SUCCESS , datas : [] , data : null ,
                breadcrumbStack : []};
        case GOTO_ADD:
            return {isFetching : false,  operationType : GOTO_ADD , datas : state.datas, data : null,
                breadcrumbStack : [breadcrumbStackList]};
        case GOTO_DETAIL:
            return {isFetching : false, operationType : GOTO_DETAIL, datas : state.datas, data : action.data ,
                breadcrumbStack : [breadcrumbStackList , {caption : action.data.caption , to : "/tenant/detail/" + action.data.id }]};
        case UPDATE_DATA:
            console.log("UPDATE_DATA " + action.data);
            return {isFetching : false, operationType : UPDATE_DATA, datas : state.datas, data : action.data,
                breadcrumbStack : [breadcrumbStackList , {caption : action.data.caption , to : "/tenant/detail/" + action.data.id }]};
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
        return axios.get(`https://115y9im0ec.execute-api.ap-northeast-1.amazonaws.com/develop/select`)
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

export const updateData  = (data) => {
    return {
        type: UPDATE_DATA,
        data: data
    }
};
