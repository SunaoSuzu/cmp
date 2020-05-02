import React , { Component  } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {makeStyles} from "@material-ui/core/styles";
import {useRouteMatch} from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';

{/*
  見た目に責務を持つので、データの流れとかどうやってデータを取るとか、そう言う事は全く気にしない（上位レイヤーでやられる事）
  conf
*/}

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

function FabLink(props) {
    const {  to, onClick,classes } = props;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
        [to],
    );

    return (
        <Fab aria-label="Add" className={classes} color="primary" component={renderLink} onClick={onClick} >
            <AddIcon />
        </Fab>
    );
}


export default function SuTechGrid(props) {
    const classes = useStyles();
    let { path, url } = useRouteMatch();
    console.log(JSON.stringify(props));
    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <div>{props.title}</div>
                <Table >
                    <TableHead>
                        {props.gridConf.columnsDef.map((column , index ) => (
                            <TableCell align="left">{column.caption}</TableCell>
                        ))}

                    </TableHead>
                    <TableBody>
                        {props.datas.map((data, index) => (
                            <DataRow button baseTo="/tenant/detail" data={data} gridConf={props.gridConf}
                                     goDetailHandler={props.goDetailHandler} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <FabLink className={classes.fab} to="/tenant/add" onClick={props.goAddHandler} />
        </React.Fragment>
    );
}

