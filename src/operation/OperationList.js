import React from "react";
import {connect} from "react-redux";
import {getOperation} from "./OperationAppModule";
import ActionProgress from "../components/ActionProgress";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const OperationList = props => {
    const classes = useStyles();
    const rows = props.operations;
    const [loaded , setLoaded] = React.useState(false);
    let Block = null;
    if (loaded===false){
        props.getOperation();
        Block = <ActionProgress/>
        setLoaded(true);
    }else{
        Block = ""
    }
    return (
        <>
            {Block}
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>JobId</TableCell>
                        <TableCell align="right">JobStatus</TableCell>
                        <TableCell align="right">Component</TableCell>
                        <TableCell align="right">prcIdKey</TableCell>
                        <TableCell align="right">name</TableCell>
                        <TableCell align="right">subname</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.jobId}>
                            <TableCell component="th" scope="row">
                                {row.jobId}
                            </TableCell>
                            <TableCell align="right">{row.jobStatus}</TableCell>
                            <TableCell align="right">{row.component}</TableCell>
                            <TableCell align="right">{row.prcIdKey}</TableCell>
                            <TableCell align="right">{row.name}</TableCell>
                            <TableCell align="right">{row.subname}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </>
    );
}
const mapStateToProps = (state) => {
    return {
        operations: state.operations,

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getOperation: () => dispatch(getOperation()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OperationList);