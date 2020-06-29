import React from "react";
import {options} from "../../util/Util"
import Grid from "@material-ui/core/Grid";
import Selection from "../../../components/Selection";
import TextField from "@material-ui/core/TextField";
import {getProperty} from "../../../platform/util/JsonUtils"

const Field = ({field ,name, data , handleChange}) => {
    if (field.lookup){
        return <Grid item xs={field.xs} >
                <Selection input={true}
                           label={field.title}
                           name={name}
                           onChange={handleChange}
                           id="standard-basic-status"
                           value={getProperty(data, field.field)}
                           readOnly={false}
                           margin="dense"
                           options={options(field.lookup)}
                />
            </Grid>
    }else if(field.type==="number"){
        return <Grid item xs={field.xs} key={field.field}>
                <TextField
                    name={name}
                    onChange={handleChange}
                    label={field.title}
                    value={getProperty(data, field.field)}
                    type="number"
                    InputLabelProps={{
                        shrink: true
                    }}
                    margin="dense"
                />
            </Grid>
    }else{
        return <Grid item xs={field.xs} key={field.field}>
                <TextField
                    name={name}
                    onChange={handleChange}
                    label={field.title}
                    value={getProperty(data, field.field)}
                    margin="dense"
                />
            </Grid>
    }
}
export default Field;