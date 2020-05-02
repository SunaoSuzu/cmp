
const LIST = 0
const GOTO_ADD = 1
const GOTO_DETAIL = 10

const gridConf = {
    columnsDef :[
        {caption : 'テナント' , propName : 'name'},
        {caption : 'ライセンス' , propName : 'licences'},
        {caption : 'Version' , propName : 'version'},
    ],
};

const tenants = [
    { id : 1 , name : '株式会社三菱' , licences : 'CJK , CWS , CSR' , version: "8.0" },
    { id : 2 , name : '株式会社住友' , licences : 'CJK' , version: "8.0" },
    { id : 3 , name : '株式会社豊田' , licences : 'CJK' , version: "8.0" },
];





const initialState = {
    operationType : LIST,
    gridConf :gridConf,
    datas : tenants,
    data  : []
}

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case LIST:
            return {operationType : LIST , gridConf: state.gridConf , datas : state.datas , data : null};
        case GOTO_ADD:
            return {operationType : GOTO_ADD , gridConf: state.gridConf, datas : state.datas, data : null};
        case GOTO_DETAIL:
            return {operationType : GOTO_DETAIL, gridConf: state.gridConf, datas : state.datas, data : action.data};
        default:
                return state
    }
}

// Action Creators
export const selectList  = () => {
    return {
        type: LIST,
    }
}

export const selectGoToAdd  = () => {
    console.log("GOTO_ADD")
    return {
        type: GOTO_ADD,
    }
}

export const selectGoToDetail  = (data) => {
    return {
        type: GOTO_DETAIL,
        data: data
    }
}
