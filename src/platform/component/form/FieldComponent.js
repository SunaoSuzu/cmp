import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {Controller} from "react-hook-form";
import MenuItem from "@material-ui/core/MenuItem";

const Field = ({field ,name, data ,simpleName=name, register , error , control , errorMsg,defaultValue}) => {
    if (field.lookup){
        const Options = Object.keys(field.lookup).map( (f ,i) =>(
            <MenuItem value={f} key={f}>{field.lookup[f]}</MenuItem>
        ));

        return <Grid item xs={field.xs} >
            <Controller
                label={field.title}
                name={`${name}`}
                as={
                    <TextField select margin="dense">
                        {Options}
                    </TextField>
                }
                control={control}
                rules={{ required: "required" }}
                defaultValue={data[simpleName]}
                error={(error ? true : false)}
                helperText={errorMsg}
            />
        </Grid>
    }else if(field.type==="number"){
        return <Grid item xs={field.xs} key={field.field}>
            <TextField
                error={(error ? true : false)}
                helperText={errorMsg}
                name={`${name}`}
                label={field.title}
                margin="dense"
                inputRef={register({ required: "required" })}
                defaultValue={defaultValue}
                type="number"
            />
        </Grid>
    }else{
        return <Grid item xs={field.xs} key={field.field}>
            <TextField
                error={(error ? true : false)}
                helperText={errorMsg}
                name={`${name}`}
                label={field.title}
                margin="dense"
                inputRef={register({ required: "required" })}
                defaultValue={defaultValue}
            />
        </Grid>
    }
}
export default Field;