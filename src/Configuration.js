// 設定系の　JSON
// Mst 仕様
// Conf (configuration) 顧客定義(のちにテナント毎にデータを分ける)

const menuIconsDef= {
    1: {menuId:1 , caption : "Activity" , icon:"" , appTo:"/activity"},
    2:{menuId:2 , caption : "テナント" , icon:"", appTo:"/tenant" },
    3:{menuId:3 , caption : "プロダクト" , icon:"", appTo:"/product" },
    4:{menuId:4 , caption : "作業予実" , icon:"", appTo:"/operation" },
    5:{menuId:5 , caption : "通知" , icon:"" , appTo:"/home"},
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

const vpcTypeMst = {
    1: {id: 1 , caption : "環境毎にVPC"    , description : "環境数分VPCの作成を行います" },
    2: {id: 2 , caption : "テナント毎にVPC" , description : "テナント専用VPCに全環境を構築します"},
    9: {id: 9 , caption : "マルチテナント"  , description : "マルチテナント環境に配備します"},
};

const landscapeTypeMst = {
    1: {id: 1 , caption : "開発環境"  , description : "開発専用の環境です", use:1},
    10: {id: 10 , caption : "ステージング環境" , description : "受け入れ試験を行う環境です", use:1},
    100: {id: 100 , caption : "本番環境"    , description : "本番環境です" , use:1},
    200: {id: 200 , caption : "訓練環境"    , description : "本番ユーザがオペレーションを訓練する環境" , use:1},
};


const whi_configuration = {
    vpcType : [vpcTypeMst[1],vpcTypeMst[2]],
    landscapeType : [landscapeTypeMst[1],landscapeTypeMst[10],landscapeTypeMst[100]],
    menuIcons : [ menuIconsDef[1] , menuIconsDef[2],menuIconsDef[3],menuIconsDef[4],menuIconsDef[5]],
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



export default function getConfiguration(tenant){
    console.log(tenant);
    return whi_configuration;
};
