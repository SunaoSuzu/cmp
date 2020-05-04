//単なるバックアップ＋サーバ無しで開発する際に参照する

export const tenants = [
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
