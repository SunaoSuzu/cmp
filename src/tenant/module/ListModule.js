
export const GET_LIST_REQUEST = "GET_LIST_REQUEST";
export const GET_LIST_SUCCESS = "GET_LIST_SUCCESS";
export const GET_LIST_FAILURE = "GET_LIST_FAILURE";

const initialState = {
   tenants: [],
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_LIST_REQUEST:
            return {tenants: []};
        case GET_LIST_SUCCESS:
            return {tenants: action.payload };
        case GET_LIST_FAILURE:
            return {tenants: [] }; //どうするのが正しいか未定
        default:
            return state;
    }
}

export const requestSearchList = (keyword,from,size) => {
    return {
        type: GET_LIST_REQUEST,
        keyword : keyword,
        from : from,
        size : size,
    };
};
