import React from "react";
import App from "../app/App"

export default function ProductApp(props) {
  const def = {
    title : "product",
    db : {database : "cmp" ,table : "product"},
    schema:{fields : [
        {caption : "通称", name : "name" , type : "text" , required : true , unique : true},
        {caption : "名称", name : "caption" , type : "text" , required : true }
      ]}
  }
  return <App def={def} />;
}