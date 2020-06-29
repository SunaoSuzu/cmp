import React from "react";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import AddBoxIcon from "@material-ui/icons/AddBox";
import {addChild, delChild} from "../modules/AddModule";
import TableBody from "@material-ui/core/TableBody";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import Field from "./FieldComponent";
import {useDispatch} from "react-redux";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {getProperty} from "../../../platform/util/JsonUtils"

const useStyles = makeStyles(theme => ({
    divider: {
        margin: theme.spacing(1, 0)
    }
}));


const ChildTable = ({field ,name, data , handleChange }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    console.log(JSON.stringify(data));
    console.log(JSON.stringify(field));
    console.log(JSON.stringify(field.field));
    const list = getProperty(data,field.field);
    console.log(JSON.stringify(list));
    return <>
        <Divider className={classes.divider} />
        <Typography variant="subtitle1">{field.title}</Typography>
        <Grid container spacing={1}>
            <Table  aria-label="simple table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {list.length === 0 ?
                                <AddBoxIcon onClick={() => dispatch(addChild(name , {...field.initial}))}/>
                                :null}

                        </TableCell>
                        {field.fields.map( column => (
                            <TableCell key={column.field} >{column.title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map( (row,index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {list.length === (index + 1) ?
                                    <AddBoxIcon onClick={() => dispatch(addChild(name , {...field.initial}))}/>
                                    :null}
                                <IndeterminateCheckBoxIcon onClick={() => dispatch(delChild(name , row))}/>
                            </TableCell>
                            {field.fields.map( column => (
                                <TableCell key={column.field} >
                                    <Field field={column}
                                           name={field.field + "." + index + "." + column.field}
                                           data={row}
                                           handleChange={handleChange} />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid>
    </>
}
export default ChildTable;