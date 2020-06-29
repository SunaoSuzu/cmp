import React from "react";
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Link as RouterLink } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import Field from "../../component/form/FieldComponent"
import ChildTable from "../../component/form/ChildTableComponent"
import {useHandlers} from "../../CrudProvider";
import {useForm} from "react-hook-form";
import BasicLayout from "../../component/layout/BasicLayout";
import FormComponent from "../../component/form/FormComponent";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
}));


const Add = ({def,prefix}) => {
    const classes = useStyles();
    const {add,toList} = useHandlers();
    const { register,control, handleSubmit, errors } = useForm({
        defaultValues: {
            ...def.initial
        }
    });

    const onSubmit = data => {
        add(data);
    };

    if(toList){
        return <Redirect to="../list"/>
    }

    return (
        <BasicLayout title={prefix + "追加"}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ width: "100%" }}>
                    <Box display="flex" p={0} bgcolor="background.paper">
                        <Box p={0} flexGrow={1} bgcolor="background.toolbar" />
                        <Box p={0} bgcolor="background.toolbar">
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<SaveIcon />}
                                type="submit"
                                disableElevation
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                className={classes.button}
                                type="reset"
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
                    <FormComponent
                        def={def} data={def.initial} control={control}
                        errors={errors} register={register}/>

                </div>
            </form>
        </BasicLayout>
    );
};

export default Add;
