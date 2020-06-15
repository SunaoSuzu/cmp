import React,{useEffect} from "react";
import {useDef} from "../AppProvider";
import { useSelector,useDispatch } from 'react-redux'
import { getList } from '../modules/ListModule'
import { initAdd } from '../modules/AddModule'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FabLink from "../../asset/FabLink";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { NavLink } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import {Box} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import InputBase from "@material-ui/core/InputBase";
import {fade, makeStyles} from "@material-ui/core/styles";
import ActionProgress from "../../components/ActionProgress";
import useDebouncedQuery from "../../util/useDebouncedQuery";

const useStyles = makeStyles(theme => ({
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: "#fff",
        "&:hover": {
            backgroundColor: fade(theme.palette.common.black, 0.05),
        },
        marginRight: theme.spacing(1),
        marginLeft: 0,
        width: "auto",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(2),
            width: "auto",
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputRoot: {
        color: "inherit",
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create("width"),
        width: "0ch",
        "&:focus": {
            width: "12ch",
        },
        [theme.breakpoints.up("sm")]: {
            width: "8ch",
            "&:focus": {
                width: "20ch",
            },
        },
    },
    grow: {
        flexGrow: 1,
    },
}));

const List = () => {
    const classes = useStyles();
    const def = useDef();
    const list = useSelector(state => state.list.list);
    const dispatch = useDispatch();
    const [pageIndex  , setPageIndex] = React.useState(1);
    const [pageSize   , setPageSize] = React.useState(50);
    const [keyword   , setKeyword] = React.useState("");


    const onPageChange = (event,newPageIndex) => {
        setPageIndex(newPageIndex);
    };
    const onSizeChange = (event) => {
        setPageSize(event.target.value);
        setPageIndex(1);
    };
    const gotoAdd = () => {
        dispatch(initAdd());
    };

    const loadSuggestions = (query) => {
        setKeyword(query);
    }
    const { searchQuery, setSearchQuery } = useDebouncedQuery(loadSuggestions);

    useEffect( () => {
        const from = (pageIndex - 1) * pageSize;
        dispatch(getList(keyword,from,pageSize));
    },[keyword,pageIndex,pageSize])

    const es = (list.hits !== undefined);
    const total = es ? list.hits.total : 0;
    const hits  = es ? list.hits.hits.map(hit => {
        hit._source.data.highlight=hit.highlight;
        return hit._source.data;
    }) : list;

    const count = Math.floor(total / pageSize) + ((total % pageSize)===0 ? 0 : 1);
    const Pager=<Pagination count={count} page={pageIndex} onChange={onPageChange.bind()} />;


    return (
        <>
            <div className={classes.grow} />
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                <InputBase
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ "aria-label": "search" }}
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Table  size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell ></TableCell>
                        {def.schema.fields.map( (field , index) => (
                            <TableCell key={index} >{field.caption}</TableCell>
                        ) )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {hits.map( data => (
                        <TableRow key={data.id}>
                            <TableCell >
                                <NavLink to={"./profile/" + data.id} >
                                    <VisibilityIcon/>
                                </NavLink>
                            </TableCell>
                            {def.schema.fields.map( (field,index) => (
                                <TableCell key={index}>{data[field.name]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box display="flex" flexDirection="row">
                <Box flexGrow={1}>{Pager}</Box>
                <Box>
                    <Select
                        native
                        value={pageSize}
                        onChange={onSizeChange}
                        label="PageSize"
                        inputProps={{
                            name: 'PageSize',
                            id: 'outlined-age-native-simple',
                        }}
                    >
                        <option aria-label="None" value="" />
                        <option value={1}>1(test)</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </Select>
                </Box>
            </Box>
            <FabLink to="./add" onClick={gotoAdd} />
        </>
    );
}

export default List;