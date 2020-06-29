import React from "react";
import CrudProvider from "../../platform/CrudProvider"
import CustomCrudContainer from "../../platform/container/CustomCrudContainer"
import MenuDetail from "./MenuDetail";

const MenuDesigner = () => {
    return (
       <CrudProvider db="platform" table="menu">
           <CustomCrudContainer def={def} Detail={MenuDetail} prefix="メニュー定義" />
       </CrudProvider>
    );
}

const def = {
    fields : [
            {title : "表示名称" , field : "title" },
            {title : "詳細" ,    field : "description" },
        ]
}


export default MenuDesigner;