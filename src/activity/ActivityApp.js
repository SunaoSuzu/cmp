import React from "react";
import App from "../app/App"

export default function ActivityApp(props) {
  const def = {
    title : "activity",
    db : {database : "cmp" ,table : "activity"},
    schema:{fields : [
        {caption : "名称", name : "name" , type : "text" , required : true , unique : true},
        {caption : "表示名", name : "caption" , type : "text" , required : true , },
        {caption : "概要", name : "description" , type : "text" , required : true , },
        {caption : "メモ", name : "memo" , type : "text" , required : true }
      ]}
  }
  return <App def={def} />;
}
