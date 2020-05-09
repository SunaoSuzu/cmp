//所有しているライセンスから、環境の雛形を決定する
//ロジックは適当なので、いずれチャンと作らないといけない

import getConfiguration from "../Configuration";

function EnvironmentTemplateMaker(tenant) {
    let environment = {
        "name": "開発環境",
        "landScape": 1,
        "status" : 1,
        "statusCaption" : "下書き",
        "specLevel" : 1,
        "vpcType" : 1,
        "vpcTypeCaption" : "独自VPC",
        "mainComponents": null,
        "subComponents": null,
    };

    const conf = getConfiguration();
    let productArray = [];
    conf.productLicensesConf.map(function (p) {
        productArray[p.id]=p;
        return null;
    })

    let tmpMain = [];
    let tmpSub  = [];
    let amounts 　=[];
    tenant.contract.details.map(function (detail) {
        const productId = detail.productMstId;
        const productMst = productArray[productId];
        const requiredComponentMap = conf.requiredComponent;
        const requiredComponent = requiredComponentMap[productMst.name];
        requiredComponent.main.map(function (m) {
            tmpMain.push(m);
            return null;
        })
        requiredComponent.sub.map(function (m) {
            tmpSub.push(m);
            return null;
        })
        amounts.push(detail.amount);
        return null;
    })

    //重複削除
    let retMain = tmpMain.filter(function (x, i, self) {
        return self.indexOf(x) === i;
    });
    let retSub = tmpSub.filter(function (x, i, self) {
        return self.indexOf(x) === i&&retMain.indexOf(x) === -1;
    });

    //パラメータを付与（設定をちゃんと読むように直さないとダメ）
    let mainComponents = [];
    retMain.map(function (main) {
        let component = {};
        component["name"]=main;
        component["params"]=[
            {name : "memory"  , caption : "メモリ", default : 8 , now : 8 , pattern : [2,4,6,8,12,16]},
            {name : "p1"  , caption : "パラメータ１", default : "" , now : "hoge" , pattern : ["","hoge","foo"]}
        ]
        mainComponents.push(component);
        return null;
    })
    let subComponents = [];
    retSub.map(function (sub) {
        let component = {};
        component["name"]=sub;
        component["params"]=[
            {name : "memory"  , default : 8 , now : 8 , pattern : [2,4,6,8,12,16]},
            {name : "p1"  , default : "" , now : "hoge" , pattern : ["","hoge","foo"]}
        ]
        subComponents.push(component);
        return null;
    })

    environment["mainComponents"]=mainComponents;
    environment["subComponents"]=subComponents;

    let maxAmount = Math.max.apply(null , amounts);
    let specLevel = Math.floor(maxAmount / 10000);
    environment["specLevel"] = specLevel+1;
    return environment;
}
export default EnvironmentTemplateMaker;