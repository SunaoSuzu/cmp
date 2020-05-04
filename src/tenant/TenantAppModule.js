
const LIST = 1;
const GOTO_ADD = 5;
const GOTO_DETAIL = 10;
const UPDATE_DATA = 100;


const tenants = [
    { id : 1 , name : '株式会社三菱' , statusCaption : '本番運用中' ,
        environmentSetting : { vpcType : 1  },
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
        environmentSetting : { vpcType : 2  },
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
        environmentSetting : { vpcType : 9  },
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
    datas : tenants,
    data  : {},
    breadcrumbStack : [],
};

const breadcrumbStackList = { caption : "テナント一覧" , to : "/tenant/list"};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case LIST:
            return {operationType : LIST , datas : state.datas, data : null ,
                breadcrumbStack : []};
        case GOTO_ADD:
            return {operationType : GOTO_ADD , datas : state.datas, data : null,
                breadcrumbStack : [breadcrumbStackList]};
        case GOTO_DETAIL:
            return {operationType : GOTO_DETAIL, datas : state.datas, data : action.data ,
                breadcrumbStack : [breadcrumbStackList , {caption : action.data.caption , to : "/tenant/detail/" + action.data.id }]};
        case UPDATE_DATA:
            console.log("UPDATE_DATA " + action.data);
            return {operationType : UPDATE_DATA, datas : state.datas, data : action.data,
                breadcrumbStack : [breadcrumbStackList , {caption : action.data.caption , to : "/tenant/detail/" + action.data.id }]};
        default:
                return state
    }
};

// Action Creators
export const selectList  = () => {
    return {
        type: LIST,
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
