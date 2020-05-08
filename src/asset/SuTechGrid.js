import React  from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { NavLink } from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import MoreIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
    dataRow:{
        textDecoration : "none" ,
    },
}));

function DataRow(props ) {

    const {  baseTo, data,gridConf,goDetailHandler, className } = props;

    const to = baseTo + "/" + data.id;

    return (
        <TableRow key={data.id}   >
            <TableCell key="-1">
                <NavLink to={to} className={className}>
                    <VisibilityIcon onClick={() => ( goDetailHandler ? goDetailHandler(data) : null)} />
                </NavLink>
            </TableCell>
            {gridConf.columnsDef.map((column , index ) => (
                <TableCell key={index} scope={index===0 ? 'row' : null} align="left">
                    {data[column.propName]}
                </TableCell>
            ))}
            <TableCell key="10000">
                <MoreIcon />
            </TableCell>
        </TableRow>
    );
}

export default function SuTechGrid(props) {
    const classes=useStyles();
    const selectToBase = props.selectToBase;
    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <div>{props.title}</div>
                <Table  >
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" key="-1"/>
                            {props.gridConf.columnsDef.map((column,index) => (
                                <TableCell align="left" key={index}>{column.caption}</TableCell>
                            ))}
                            <TableCell align="left" key="1000"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.datas.map((data) => (
                            <DataRow className={classes.dataRow} button key={data.id} baseTo={selectToBase} data={data} gridConf={props.gridConf}
                                     goDetailHandler={props.goDetailHandler} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}

