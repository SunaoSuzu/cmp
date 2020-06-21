import React, {useEffect} from "react";
import { useSelector,useDispatch } from 'react-redux'
import {update, getBiId,changeProperty} from "../modules/ProfileModule";
import {useDef} from "../AppProvider";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {Link as RouterLink} from "react-router-dom";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
}));


const Profile = (props) => {
    const classes = useStyles();
    const id   = props.match.params.id;
    const def  = useDef();
    const data = useSelector(state => state.profile.data);
    const dispatch = useDispatch();
    const redirect = useSelector(state => state.ui.redirect);

    useEffect( ()=>{
        dispatch(getBiId(id));
    },[id])
    function handleChange(e) {
        dispatch(changeProperty(e.target.name, e.target.value));
    }
    function handlerSubmit() {
        dispatch(update(data));
    }
    if(redirect){
        return <Redirect to="../list"/>
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
                        component={RouterLink} to="../list"
                    >
                        戻る
                    </Button>
                </Box>
            </Box>
            <Grid container spacing={1}>
                {def.schema.fields.map( field => (
                    <>
                        <Grid item xs={12} key={field.field}>
                            <TextField
                                name={field.field}
                                onChange={handleChange}
                                label={field.title}
                                value={data[field.field]}
                                helperText={field.field}
                            />
                        </Grid>
                    </>
                ))}
            </Grid>
        </div>
    );
};

export default Profile;
