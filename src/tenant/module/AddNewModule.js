import {pushEmptyToArray, setProperty, spliceObjOfArray} from "../../util/JsonUtils";

export const GOTO_ADD = "GOTO_ADD";
export const CHANGE_PROPERTY_OF_NEW = "CHANGE_PROPERTY_OF_NEW";
export const ADD_REQUEST = "ADD_REQUEST";
export const ADD_SUCCESS = "ADD_SUCCESS";
export const DEL_FROM_ARRAY_NEW = "DEL_FROM_ARRAY_NEW";
export const PUSH_EMPTY_TO_ARRAY_NEW = "PUSH_EMPTY_TO_ARRAY_NEW";

export const noNeed = 1;
export const necessary = 2;
export const syncing = 3;
export const synced = 4;


const initialState = {
    newData: {},
    addComplete: noNeed,
};

export const empty = {
    name: "",
    alias : "",
    awsTag:"",
    status: 1,
    statusCaption: "下書き",
    tags: [{}],
    environmentSetting: {
        vpcType: 1,
    },
    contract: {
        details: [
            { productMstId: "", amount: "" }, //empty_contractを参照できない
        ],
    },
    environments: [],
};



export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GOTO_ADD:
            return {
                ...state,
                newData: { ...empty },
                addComplete: noNeed,
            };
        case CHANGE_PROPERTY_OF_NEW:
            const obj = { ...state.newData };
            setProperty(obj, action.name, action.value);
            return { ...state, newData: obj, addComplete: necessary };
        case ADD_REQUEST:
            return { ...state, addComplete: syncing };
        case ADD_SUCCESS:
            return {
                ...state,
                addComplete: synced,
                newData: action.tenant,
            };
        case PUSH_EMPTY_TO_ARRAY_NEW:
            return {
                ...state,
                operationType: PUSH_EMPTY_TO_ARRAY_NEW,
                newData: pushEmptyToArray(
                    { ...state.newData },
                    action.path,
                    action.empty
                ),
                addComplete: necessary,
            };
        case DEL_FROM_ARRAY_NEW:
            return {
                ...state,
                operationType: DEL_FROM_ARRAY_NEW,
                newData: spliceObjOfArray(
                    { ...state.newData },
                    action.path,
                    action.index
                ),
                addComplete: necessary,
            };
        default:
            return state;
    }
}

export const goToAdd = () => {
    return {
        type: GOTO_ADD,
    };
};

export const changePropertyOfNew = (e) => {
    return {
        type: CHANGE_PROPERTY_OF_NEW,
        name: e.target.name,
        value: e.target.value,
    };
};

export const requestAdd = (tenant) => {
    return {
        type: ADD_REQUEST,
        tenant: tenant,
    };
};

export const pushEmptyForNew = (path, empty) => {
    return {
        type: PUSH_EMPTY_TO_ARRAY_NEW,
        path: path,
        empty: empty,
    };
};

export const delFromArrayForNew = (path, index) => {
    return {
        type: DEL_FROM_ARRAY_NEW,
        path: path,
        index: index,
    };
};
