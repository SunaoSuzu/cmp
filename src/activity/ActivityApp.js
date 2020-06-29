import React from "react";
import CrudProvider from "../platform/CrudProvider";
import BasicCrudContainer from "../platform/container/BasicCrudContainer";

/**
 * 本来の用途とは違う試験用の設定
 * */
export default function ActivityApp(props) {
  const def = {
    title : "activity",
    database : "cmp" ,table : "activity",
    fields : [
        {title : "名称", field : "name" , type : "text" , required : true , unique : true},
        {title : "表示名", field : "caption" , type : "text" , required : true , },
        {title : "概要", field : "description" , type : "text" , required : true , },
        {title : "メモ", field : "memo" , type : "text" , required : true }
      ]
  }
  return (
    <CrudProvider db={def.database} table={def.table}>
        <BasicCrudContainer def={def}/>
    </CrudProvider>
  )
}
