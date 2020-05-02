
const LIST = 1
const GOTO_ADD = 5
const GOTO_DETAIL = 10
const UPDATE_DATA = 100

//設定関係（いずれDBへ）
const gridConf = {
    columnsDef :[
        {caption : 'テナント' , propName : 'name'},
        {caption : '状況' , propName : 'statusCaption'},
    ],
};

const productGridConf = {
    columnsDef :[
        {caption : 'ライセンス名称' , propName : 'caption'},
        {caption : 'Version' , propName : 'version'},
        {caption : 'Patch' , propName : 'patch'},
    ],
};


const tenants = [
    { id : 1 , name : '株式会社三菱' , statusCaption : '本番運用中' ,
        environments : [
            {envId:1,ord:1,landScape:1,
                installedLicences :[
                    {id : 1 ,  caption  : "CJK" , version : 8 , patch : 10 },
                    {id : 10 , caption : "CWS" , version : 8 , patch : 10 },
                    {id : 20 , caption : "CSR" , version : 8 , patch : 10 },
                ]
            },
            {envId:2,ord:2,landScape:3,
                installedLicences :[
                    {id : 1 , caption  : "CJK" , version : 8 , patch : 10 },
                    {id : 10 , caption : "CWS" , version : 8 , patch : 10 },
                    {id : 20 , caption : "CSR" , version : 8 , patch : 10 },
                ]
            },
        ],
    },
    { id : 2 , name : '住友商事' , statusCaption : '導入中' ,
        environments : [
            {envId:3,ord:1,landScape:1,
                installedLicences :[
                    {id : 1 , caption  : "CJK" , version : 8 , patch : 10 },
                    {id : 10 , caption : "CWS" , version : 8 , patch : 10 },
                    {id : 20 , caption : "CSR" , version : 8 , patch : 10 },
                ]
            },
        ],
    },
    { id : 3 , name : '帝国会社' , statusCaption : '本番運用中' ,
        environments : [
            {envId:4,ord:1,landScape:1,
                installedLicences :[
                    {id : 1 , caption  : "CJK" , version : 8 , patch : 10 },
                    {id : 10 , caption : "CWS" , version : 8 , patch : 10 },
                    {id : 20 , caption : "CSR" , version : 8 , patch : 10 },
                ]
            },
            {envId:5,ord:2,landScape:2,
                installedLicences :[
                    {id : 1 , caption  : "CJK" , version : 8 , patch : 10 },
                    {id : 10 , caption : "CWS" , version : 8 , patch : 10 },
                    {id : 20 , caption : "CSR" , version : 8 , patch : 10 },
                ]
            },
            {envId:6,ord:3,landScape:3,
                installedLicences :[
                    {id : 1 , caption  : "CJK" , version : 8 , patch : 10 },
                    {id : 10 , caption : "CWS" , version : 8 , patch : 10 },
                    {id : 20 , caption : "CSR" , version : 8 , patch : 10 },
                ]
            },
        ],
    },
];





const initialState = {
    operationType : LIST,
    gridConf :gridConf,
    productGridConf :productGridConf,
    datas : tenants,
    data  : []
}

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case LIST:
            return {operationType : LIST , gridConf: state.gridConf ,productGridConf :productGridConf,
                datas : state.datas , data : null};
        case GOTO_ADD:
            return {operationType : GOTO_ADD , gridConf: state.gridConf,productGridConf :productGridConf,
                datas : state.datas, data : null};
        case GOTO_DETAIL:
            return {operationType : GOTO_DETAIL, gridConf: state.gridConf,productGridConf :productGridConf,
                datas : state.datas, data : action.data};
        case UPDATE_DATA:
            console.log("UPDATE_DATA " + action.data);
            return {operationType : UPDATE_DATA, gridConf: state.gridConf,productGridConf :productGridConf,
                datas : state.datas, data : action.data};
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

export const updateData  = (data) => {
    return {
        type: UPDATE_DATA,
        data: data
    }
}
