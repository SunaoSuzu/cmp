import React from "react"

export async function load() {
    const menu = [99,1593138196356,1,2,3,4,5,11];
    const menuIcons = menu.map( id => {
        const icon = {...menuIconsDef[id]};
        return icon
    })

    return {
        menuIcons: menuIcons,
        reportIcons: [reportIconsDef[11], reportIconsDef[12]],
        menuOptions: {1593138196356 : option}
    }
}



const menuIconsDef = {
    1: {
        id: 1,
        caption: "Activity",
        icon: "accountBox",
        appTo: "/activity"
    },
    2: { id: 2, caption: "テナント", icon: "business", appTo: "/tenant" },
    3: { id: 3, caption: "プロダクト", icon: "code", appTo: "/product" },
    4: {
        id: 4,
        caption: "作業予実",
        icon: "assignment",
        appTo: "/operation/list"
    },
    5: { id: 5, caption: "通知", icon: "notifications", appTo: "/home" },
    11: {
        id: 11,
        caption: "AWS Asset",
        icon: "cloudDownload",
        appTo: "/aws/asset"
    },
    99: {
        id: 99,
        caption: "Designer",
        icon: "settingsApplications",
        appTo: "/designer"
    },
    1593138196356 :{
        id: 1593138196356,
        caption: "sample",
        icon: "appsOutlined",
        appTo: "/app"
    },
};

const reportIconsDef = {
    11: {
        id: 11,
        caption: "レポート",
        icon: "dashboard",
        reportTo: "/report"
    },
    12: {
        id: 12,
        caption: "レポート2",
        icon: "report",
        reportTo: "/report"
    },
    13: {
        id: 13,
        caption: "レポート",
        icon: "note",
        reportTo: "/report"
    }
};

const option = {
    "schema":{
        "fields":[
            {"xs":"6","type":"text","title":"名称","field":"name"},
            {"xs":"6","type":"number","title":"年齢","field":"age"}
        ]
    },
    "id":1593164849977,
    "title":"サンプル",
    "type":"crud",
    "db":{"database":"platform","table":"sample"},"revision":1
}