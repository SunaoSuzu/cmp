import React from "react";
import { useSelector,useDispatch } from 'react-redux'
import {add,changeProperty} from "../modules/AddModule";
import {useDef} from "../AppProvider";
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { Link as RouterLink } from 'react-router-dom';
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
}));


const Add = () => {
    const classes = useStyles();
    const def = useDef();
    const data = useSelector(state => state.add.data);
    const redirect = useSelector(state => state.ui.redirect);
    const dispatch = useDispatch();

    function handleChange(e) {
        dispatch(changeProperty(e.target.name, e.target.value));
    }
    function handlerSubmit() {
        dispatch(add(data));
    }

    if(redirect){
        return <Redirect to="./list"/>
    }
    return (
        <div style={{ width: "100%" }}>
            <Box display="flex" p={0} bgcolor="background.paper">
                <Box p={0} flexGrow={1} bgcolor="background.toolbar" />
                <Box p={0} bgcolor="background.toolbar">
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        onClick={handlerSubmit}
                        disableElevation
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.button}
                        disableElevation
                    >
                        リセット
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.button}
                        disableElevation
                        component={RouterLink} to="./list"
                    >
                        戻る
                    </Button>
                </Box>
            </Box>
            <Grid container spacing={1}>
                {def.schema.fields.map( field => (
                    <Grid item xs={12} key={field.field}>
                        <TextField
                            name={field.field}
                            onChange={handleChange}
                            label={field.title}
                            value={data[field.field]}
                            helperText={field.field}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Add;
