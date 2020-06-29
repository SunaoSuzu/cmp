import React from "react";
import BasicCrudContainer from "../../platform/container/BasicCrudContainer";
import CrudProvider from "../../platform/CrudProvider";

const MenuDesigner = () => {
    return (
        <CrudProvider db={def.database} table={def.table}>
            <BasicCrudContainer def={def}/>
        </CrudProvider>
    );
}

const def = {
    title : "アプリ設定",
    database : "platform" ,table : "app",
    initial : { title : "x" , database : "platform" , table : "y" , type : "crud", fields :[]},
    fields : [
            {title : "表示名称" , field : "title" ,    type : "text" ,xs:4},
            {title : "テーブル" , field : "table" ,    type : "text" ,xs:4},
            {title : "種類"    , field : "type" 　,   type : "text" ,
                lookup: { "crud": 'CRUD', "listMod": '一覧編集',} ,xs:4},
            {title : "フィールド" , type : "list" , field : "fields" ,
                initial : {title : "a" ,type:"text" , xs :3 , },
                fields : [
                    {title : "表示名称" , field : "title" ,    type : "text"},
                    {title : "カラム名" , field : "field" ,    type : "text"},
                    {title : "データ種別" , field : "type"  ,    type : "text",
                        lookup: { "text": '文字', "number": '数字',}},
                    {title : "xs(12で一列)" , field : "xs" ,    type : "number"},
                ]}
        ]
}

export default MenuDesigner;