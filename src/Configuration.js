// 設定系の　JSON
// Mst 仕様
// Conf (configuration) 顧客定義(のちにテナント毎にデータを分ける)

const menuIconsDef= {
    1:{menuId:1 , caption : "Activity" , icon:"" , appTo:"/activity"},
    2:{menuId:2 , caption : "テナント" , icon:"", appTo:"/tenant" },
    3:{menuId:3 , caption : "プロダクト" , icon:"", appTo:"/product" },
    4:{menuId:4 , caption : "作業予実" , icon:"", appTo:"/operation" },
    5:{menuId:5 , caption : "通知" , icon:"" , appTo:"/home"},
    11:{menuId:11 , caption : "AWS Asset" , icon:"" , appTo:"/aws/asset"},
};

const reportIconsDef= {
    11:{reportId:11 , caption : "レポート" , icon:"" ,reportTo:"/report"},
    12:{reportId:12 , caption : "レポート2" , icon:"" ,reportTo:"/report"},
    13:{reportId:13 , caption : "レポート" , icon:"" ,reportTo:"/report"},
};

const tenantListGridColumnsDef = {
     1:   {caption : 'テナント' , propName : 'name'},
     2:   {caption : '状況' , propName : 'statusCaption'},
};

const productGridColumnsDef = {
     1:   {caption : 'ライセンス名称' , propName : 'caption'},
     2:   {caption : 'Version' , propName : 'version'},
     3:   {caption : 'Patch' , propName : 'patch'},
};

const tenantVpcTypeMst = {
    1: {id: 1 , caption : "環境毎にVPC"    , description : "環境数分VPCの作成を行います" },
    2: {id: 2 , caption : "テナント毎にVPC" , description : "テナント専用VPCに全環境を構築します"},
    9: {id: 9 , caption : "マルチテナント"  , description : "マルチテナント環境に配備します"},
};

const environmentVpcTypeMst = {
    1: {id: 1 , caption : "独自VPC"          , description : "環境数分VPCの作成を行います" },
    2: {id: 2 , caption : "テナントVPC"       , description : "テナント専用VPCに全環境を構築します"},
    9: {id: 9 , caption : "マルチテナントVPC"  , description : "マルチテナント環境に配備します"},
};


const landscapeTypeMst = {
    1: {id: 1 , caption : "開発環境"  , description : "開発専用の環境です", use:1},
    10: {id: 10 , caption : "ステージング環境" , description : "受け入れ試験を行う環境です", use:1},
    100: {id: 100 , caption : "本番環境"    , description : "本番環境です" , use:1},
    200: {id: 200 , caption : "訓練環境"    , description : "本番ユーザがオペレーションを訓練する環境" , use:1},
};

const environmentStatusMst = [
    {id: 1 , caption : "未作成（予定なし）"  , description : "下書き", use:1},
    {id: 10 , caption : "未作成（予定あり）" , description : "作業待ち", use:1},
    {id: 100 , caption : "作成済み"    , description : "作成済み（予定なし）" , use:1},
    {id: 200 , caption : "作成済み(予定あり)"    , description : "作成済み（予定あり）" , use:1},
];

const tenantStatusMst = [
    {id: 1 , caption : "下書き"  , description : "下書き", use:1},
    {id: 10 , caption : "導入中" , description : "作業待ち", use:1},
    {id: 100 , caption : "本番稼働"    , description : "作成済み（予定なし）" , use:1},
    {id: 200 , caption : "本番稼働(変更予定あり)"    , description : "作成済み（予定あり）" , use:1},
];

//以下は設定ではなくマスタ。将来は不要になるはず
//販売製品
const productLicensesConf = {
    "CJK" : { id : 1 , name:"CJK" , caption : "CJK"  , options : []   },
    "CWS" : { id : 2 , name:"CWS" , caption : "CWS"  , options : []   },
    "CSR" : { id : 3 , name:"CSR" , caption : "CSR"  , options : []   },
    "CTM" : { id : 4 , name:"CTM" , caption : "CTM"  , options : []   },
};


const installableComponentConf = {
    "CJK_AP" : { id : 1  , name:"CJK_AP" , caption : "CJK_AP", type:1, params: [
        {name : "p1"  , caption : "パラメータ1", default : "" , now : "hoge" , pattern : ["","hoge","foo"]},
        {name : "p2"  , caption : "パラメータ2", default : "" , now : "hoge" , pattern : ["","hoge","foo"]},
        {name : "p3"  , caption : "パラメータ3", default : "" , now : "hoge" , pattern : ["","hoge","foo"]},
        ]     },
    "CJK_DB" : { id : 2  , name:"CJK_DB" , caption : "CJK_DB", type:2, params: [
        {name : "p1"  , caption : "param1", default : "" , now : "hoge" , pattern : ["","hoge","foo"]},
        {name : "p2"  , caption : "param2", default : "" , now : "hoge" , pattern : ["","hoge","foo"]},
        ]     },
    "CJK_BS" : { id : 3  , name:"CJK_BS" , caption : "CJK_BS", type:3, params: []     },
    "CWS_AP" : { id : 4  , name:"CWS_AP" , caption : "CWS_AP", type:1, params: []     },
    "CWS_DB" : { id : 5  , name:"CWS_DB" , caption : "CWS_DB", type:2, params: []     },
    "CWS_BD" : { id : 6  , name:"CWS_BD" , caption : "CWS_BD", type:3, params: []     },
    "CTM_AP" : { id : 7  , name:"CTM_AP" , caption : "CTM_AP", type:1, params: []     },
    "CTM_DB" : { id : 8  , name:"CTM_DB" , caption : "CTM_DB", type:2, params: []     },
    "CTM_ES" : { id : 9  , name:"CTM_ES" , caption : "CTM_ES", type:4, params: []     },
    "CTM_BS" : { id : 10 , name:"CTM_BS" , caption : "CTM_BS", type:3, params: []     },
};

const requiredComponentConf = {
    "CJK"    : { "main" : ["CJK_AP","CJK_DB","CJK_BS" ] , sub : []},
    "CWS" : { "main" : ["CWS_AP","CWS_DB","CWS_BS", "CWS_DL" ] , "sub" : ["CJK_AP","CJK_DB","CJK_BS" ]},
    "CSR" : { "main" : [] , "sub" : ["CWS_AP","CWS_DB","CWS_BS", "CWS_DL" , "CJK_AP","CJK_DB","CJK_BS" ]},
    "CTM"    : { "main" : ["CTM_AP","CTM_DB","CTM_ES" , "CTM_BS" ] , sub : []},
}

const awsTagUsage = {
    flg : true ,
    tenant : "tenant",
    environment : "landscape",
    system : "system",
    component : "component" ,
}

const whi_configuration = {
    tagUsage : awsTagUsage,
    tenantStatusMst:tenantStatusMst,
    requiredComponent : requiredComponentConf,
    installableComponentConf : installableComponentConf,
    tenantVpcTypeMst : [tenantVpcTypeMst[1],tenantVpcTypeMst[2]],
    environmentVpcTypeMst : [environmentVpcTypeMst[1],environmentVpcTypeMst[2]],

    landscapeTypes : [landscapeTypeMst[1],landscapeTypeMst[10],landscapeTypeMst[100]],
    productLicensesConf : [productLicensesConf["CJK"],productLicensesConf["CWS"],productLicensesConf["CSR"],productLicensesConf["CTM"]],
    environmentStatusMst : environmentStatusMst,

    menuIcons : [ menuIconsDef[1] , menuIconsDef[2],menuIconsDef[3],menuIconsDef[4],menuIconsDef[5],menuIconsDef[11]],
    reportIcons : [ reportIconsDef[11] , reportIconsDef[12]],
    tenantListGridConf : { columnsDef :[
            tenantListGridColumnsDef[1],tenantListGridColumnsDef[2]
        ]
    },
    productGridConf : { columnsDef :[
            productGridColumnsDef[1],productGridColumnsDef[2],productGridColumnsDef[3]
        ]
    },
};


//いずれテナントで分岐
export default function getConfiguration(){
    return whi_configuration;
};

