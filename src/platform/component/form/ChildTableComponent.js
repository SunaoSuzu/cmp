import React from "react";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import AddBoxIcon from "@material-ui/icons/AddBox";
import TableBody from "@material-ui/core/TableBody";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import Field from "./FieldComponent";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useFieldArray} from "react-hook-form";

const useStyles = makeStyles(theme => ({
    divider: {
        margin: theme.spacing(1, 0)
    }
}));


const ChildTable = ({field , register , errors ,control }) => {
    const classes = useStyles();

    const { fields, append, remove } = useFieldArray({
        control,
        name: field.field
    });

    return <>
        <Divider className={classes.divider} />
        <Typography variant="subtitle1">{field.title}</Typography>
        <Grid container spacing={1}>
            <Table  aria-label="simple table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        {field.fields.map( column => (
                            <TableCell key={column.field} >{column.title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fields.map( (row,index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <IndeterminateCheckBoxIcon onClick={() => remove(index)}/>
                            </TableCell>
                            {field.fields.map( column => (
                                <TableCell key={column.field} >
                                    <Field field={column}
                                           name={`${field.field}[${index}].${column.field}`}
                                           error={errors?.[field.field]?.[index]?.[column.field]}
                                           errorMsg={errors?.[field.field]?.[index]?.[column.field]?.message}
                                           data={row}
                                           simpleName={column.field}
                                           defaultValue={row[column.field]}
                                           register={register}
                                           control={control}
                                            />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell>
                            <AddBoxIcon
                                onClick={() => append({...field.initial})}/>
                        </TableCell>
                        {field.fields.map( column => (
                            <TableCell key={column.field} />
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </Grid>
    </>
}
export default ChildTable;