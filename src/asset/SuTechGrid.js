import React  from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from "@material-ui/core/styles";
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

function DataRow(props ) {

    const {  baseTo, data,gridConf,goDetailHandler } = props;

    const to = baseTo + "/" + data.id;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
        [to],
    );

    return (
        <TableRow key={data.id} onClick={() => ( goDetailHandler ? goDetailHandler(data) : null)} component={renderLink} >
            {gridConf.columnsDef.map((column , index ) => (
                <TableCell scope={index===0 ? 'row' : null} align="left">
                    {data[column.propName]}
                </TableCell>
            ))}
        </TableRow>
    );
}

export default function SuTechGrid(props) {
    const classes = useStyles();
    const selectToBase = props.selectToBase;
    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <div>{props.title}</div>
                <Table className={classes} >
                    <TableHead>
                        {props.gridConf.columnsDef.map((column) => (
                            <TableCell align="left">{column.caption}</TableCell>
                        ))}

                    </TableHead>
                    <TableBody>
                        {props.datas.map((data) => (
                            <DataRow button baseTo={selectToBase} data={data} gridConf={props.gridConf}
                                     goDetailHandler={props.goDetailHandler} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}

