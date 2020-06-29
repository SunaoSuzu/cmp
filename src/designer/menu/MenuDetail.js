import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import {Link as RouterLink} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import {useHandlers} from "../../platform/CrudProvider"
import TextField from "@material-ui/core/TextField";
import * as a from "../../platform/util/BasicActions"
import { useForm,useFieldArray,Controller } from "react-hook-form";
import BasicLayout from "../../platform/component/layout/BasicLayout";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import AddBoxIcon from "@material-ui/icons/AddBox";
import TableBody from "@material-ui/core/TableBody";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import {getOptions} from "../../platform/MenuIcons"
import MenuItem from "@material-ui/core/MenuItem";
import {useFetcher} from "../../platform/CrudProvider"

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    formControl: {
        margin: theme.spacing(1),
        // alignItems: "center",
        minWidth: 120
    },
}));




const MenuDetail = ({mode,prefix , data}) => {
    const classes = useStyles();
    const icons = getOptions();
    const apps  = useFetcher("apps","platform","app");
    console.log("apps:" + JSON.stringify(apps));
    const {add , update} = useHandlers();
    const { register,control, handleSubmit, errors } = useForm({
        defaultValues: {
            title : "",
            description:"",
            menus: []
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "menus"
    });
    const onSubmit = data => {
        switch (mode) {
            case a.MODE_ADD:{
                add(data);
            }
            case a.MODE_UPDATE:{
                update(data);
            }
        }
    };

    const Options  = icons.map(( icon , index )=>{
        const IconTag = icon.icon;
        return <MenuItem value={icon.id} key={icon.id}>
            <IconTag />
        </MenuItem>
    })

    return (
        <BasicLayout title={prefix + "詳細画面"} >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ width: "100%" }}>
                    {errors.exampleRequired && <span>This field is required</span>}
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
                                disableElevation
                                type="reset"
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
                        <Grid item xs={6} >
                            <TextField
                                error={(errors.title ? true : false)}
                                helperText={errors.title?.message}
                                name="title"
                                label="名称"
                                margin="dense"
                                inputRef={register({ required: "required" })}

                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                error={(errors.description ? true : false)}
                                helperText={errors.description?.message}
                                name="description"
                                label="説明"
                                margin="dense"
                                inputRef={register({ required: "required" })}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <Grid container spacing={1}>
                                <Table  aria-label="simple table" size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell/>
                                            <TableCell  ></TableCell>
                                            <TableCell  >アイコン</TableCell>
                                            <TableCell  >名称</TableCell>
                                            <TableCell  >サービス</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fields.map( (item,index) => {
                                            return <TableRow key={index}>
                                                <TableCell>
                                                    <IndeterminateCheckBoxIcon onClick={() => remove(index)}/>
                                                </TableCell>
                                                <TableCell></TableCell>
                                                <TableCell>
                                                    <Controller
                                                        name={`menus[${index}].icon`}
                                                        as={
                                                            <TextField select margin="dense">
                                                                {Options}
                                                            </TextField>
                                                        }
                                                        control={control}
                                                        rules={{ required: true }}
                                                        defaultValue={item.icon}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        name={`menus[${index}].title`} defaultValue={item.title}
                                                        margin="dense"
                                                        inputRef={register({required: "required"})}
                                                        defaultValue={item.title}
                                                        error={(errors.menus?.[index]?.title ? true : false)}
                                                        helperText={errors.menus?.[index]?.title?.message}

                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        name={`menus[${index}].service`} defaultValue={item.service}
                                                        margin="dense"
                                                        inputRef={register({required: "required"})}
                                                        defaultValue={item.service}
                                                        error={(errors.menus?.[index]?.service ? true : false)}
                                                        helperText={errors.menus?.[index]?.service?.message}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        })}
                                        <TableRow>
                                            <TableCell>
                                                    <AddBoxIcon
                                                        onClick={() => append({title: "abc", icon: "note"})}/>
                                            </TableCell>
                                            <TableCell/>
                                            <TableCell/>
                                            <TableCell/>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </form>
        </BasicLayout>
    )
}
export default MenuDetail;
