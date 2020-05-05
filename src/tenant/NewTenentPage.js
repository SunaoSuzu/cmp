import React from "react";
import TextField from "@material-ui/core/TextField";

export default function NewTenantPage(props) {
    const { addData , changePropertyOfNew,addComplete,newData } = props;
    const send = function send(e){
        console.log(e);
        addData(newData);
    };

    return (
        <React.Fragment>
            <button onClick={send.bind(this)}>更新</button><div> updateComplete={addComplete}</div>
            <form  encType='multipart/form-data' >
                <div>TenantAdd()</div>
                <TextField name="name" onChange={changePropertyOfNew} id="standard-basic" label="テナント名"  helperText="会社名を入れてください" />
            </form>
        </React.Fragment>
    )
}
