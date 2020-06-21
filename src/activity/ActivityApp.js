import React from "react";
import App from "../app/App"

/**
 * 本来の用途とは違う試験用の設定
 * */
export default function ActivityApp(props) {
  const def = {
    title : "activity",
    db : {database : "cmp" ,table : "activity"},
    schema:{fields : [
        {title : "名称", field : "name" , type : "text" , required : true , unique : true},
        {title : "表示名", field : "caption" , type : "text" , required : true , },
        {title : "概要", field : "description" , type : "text" , required : true , },
        {title : "メモ", field : "memo" , type : "text" , required : true }
      ]}
  }
  return <App def={def} />;
}
