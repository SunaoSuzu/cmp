import React from "react";
import TextField from "@material-ui/core/TextField";

export default function NewTenant(props) {
    return (
        <React.Fragment>
            <form  encType='multipart/form-data' >
                <div>TenantAdd()</div>
                <TextField id="standard-basic" label="テナント名"  helperText="会社名を入れてください" />
                <TextField id="standard-basic" label="インフラ年間予算"  helperText="インフラ年間予算" />
            </form>
        </React.Fragment>
    )
}
