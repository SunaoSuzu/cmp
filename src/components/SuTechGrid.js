import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import MoreIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  dataRow: {
    textDecoration: "none",
  },
}));

function DataRow(props) {
  const {
    baseTo,
    data,
    gridConf,
    goDetailHandler,
    className,
    deleteHandler,
  } = props;

  const to = baseTo + "/" + data.id;

  const deleteData = function deleteData(id) {
    console.log("deleteHandler=" + id);

    if (deleteHandler !== null) {
      deleteHandler(id);
    }
  };

  return (
    <TableRow key={data.id}>
      <TableCell key="-1">
        <NavLink to={to} className={className}>
          <VisibilityIcon
            onClick={() => (goDetailHandler ? goDetailHandler(data) : null)}
          />
        </NavLink>
      </TableCell>
      {gridConf.columnsDef.map((column, index) => (
        <TableCell key={index} scope={index === 0 ? "row" : null} align="left">
          {data[column.propName]}
        </TableCell>
      ))}
      <TableCell key="10000">
        <MoreIcon />
        <DeleteIcon onClick={() => deleteData(data.id)} />
      </TableCell>
    </TableRow>
  );
}

export default function SuTechGrid(props) {
  const classes = useStyles();
  const selectToBase = props.selectToBase;

  //とりあえずの互換
  const elasticSearch = props.selectToBase;
  let datas           = props.datas;

  if(elasticSearch){

    //とりあえずの互換
    const ret = datas.hits.hits.map(function (hit) {
          hit._source.highlight=hit.highlight;
          return hit._source.data;
        }
    )
    datas=ret;
  }

  return (
    <React.Fragment>
      {/* <TableContainer component={Paper}> */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left" key="-1" />
            {props.gridConf.columnsDef.map((column, index) => (
              <TableCell align="left" key={index}>
                {column.caption}
              </TableCell>
            ))}
            <TableCell align="left" key="1000" />
          </TableRow>
        </TableHead>
        <TableBody>
          {datas.map((data) => (
            <DataRow
              className={classes.dataRow}
              button
              key={data.id}
              baseTo={selectToBase}
              data={data}
              gridConf={props.gridConf}
              goDetailHandler={props.goDetailHandler}
              deleteHandler={props.deleteHandler}
            />
          ))}
        </TableBody>
      </Table>
      {/* </TableContainer> */}
    </React.Fragment>
  );
}
