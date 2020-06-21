import React from "react";
import App from "../app/App"

export default function ProductApp(props) {
  const def = {
    title : "product",
    db : {database : "cmp" ,table : "product"},
    schema:{fields : [
        {title : "通称", field : "name" ,    type : "text" , required : true , unique : true},
        {title : "名称", field : "caption" , type : "text" , required : true }
      ]}
  }
  return <App def={def} />;
}