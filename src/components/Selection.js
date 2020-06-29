import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        // alignItems: "center",
        minWidth: 120
    },
}));

const Selection      = props => {
    const input      = props.input;  //show or input
    const id         = props.id;
    const name       = props.name;
    const value      = props.value;
    const options    = props.options;  //[{id : id , caption : caption}]
    const onChange   = props.onChange;
    const label      = props.label;
    const helperText = props.helperText;
    const readOnly   = props.readOnly;
    const required   = props.required;
    const margin     = props.margin;
    const inputRef   = props.inputRef;
    const defaultValue = props.defaultValue;
    const classes    = useStyles();

    const handleChange = (event, newValue) => {
        if(onChange)onChange(event , newValue);
    };

    const valToStr = function valToStr(v){
        const matched = options.find( option => option.id===v );
        if (matched===null){
            return null;
        }else{
            return matched.caption;
        }
    }

    if(!input){
        const caption = valToStr(value);
        return (<>{caption}</>);
    } else {
        return (
            <FormControl className={classes.formControl}>
                <InputLabel shrink id={(id!=null?id:name) + "-label"}>
                    {label}
                </InputLabel>
                <Select
                    name={name}
                    onChange={handleChange.bind()}
                    id={(id!=null?id:name)}
                    value={value}
                    inputProps={{
                        readOnly: readOnly,
                        required: required,
                    }}
                    inputRef={inputRef}
                    margin={margin}
                    defaultValue={defaultValue}
                >
                    {options.map(option => (
                        <MenuItem value={option.id} key={option.id}>
                            {option.caption}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        );
    }
}

export default Selection;