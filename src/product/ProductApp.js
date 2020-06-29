import React from "react";
import CrudProvider from "../platform/CrudProvider";
import BasicCrudContainer from "../platform/container/BasicCrudContainer";

export default function ProductApp(props) {
  const def = {
    title : "product",
    type  : "listMod",
    database : "cmp" ,table : "product",
    fields : [
        {title : "通称", field : "name" ,    type : "text" , required : true , unique : true},
        {title : "名称", field : "caption" , type : "text" , required : true }
      ]
  }
  return (
        <CrudProvider db={def.database} table={def.table}>
            <BasicCrudContainer def={def}/>
        </CrudProvider>
    )

}