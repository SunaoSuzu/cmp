import React, {useEffect} from "react";
import SuTechGrid from "../components/SuTechGrid";
import * as tenantAppModule from "./module/TenantAppModule";
import { connect } from "react-redux";
import FabLink from "../asset/FabLink";
import getConfiguration from "../Configuration";
import Pagination from "@material-ui/lab/Pagination";
import useDebouncedQuery from "../util/useDebouncedQuery";
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import {Box} from "@material-ui/core";
import ActionProgress from "../components/ActionProgress";
import {requestSearchList} from "./module/ListModule";
import {goToAdd} from "./module/AddNewModule";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import InputBase from "@material-ui/core/InputBase";
import {fade, makeStyles} from "@material-ui/core/styles";

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


function TenantList(props) {
  const classes = useStyles();
  const conf = getConfiguration();
  const gridConf = conf.tenantListGridConf;

  const [pageIndex  , setPageIndex] = React.useState(1);
  const [pageSize   , setPageSize] = React.useState(50);
  const [keyword   , setKeyword] = React.useState("");

  const BLOCK = props.blocking ? <ActionProgress/>:"";
  const loadSuggestions = (query) => {
    setKeyword(query);
  }
  const { searchQuery, setSearchQuery } = useDebouncedQuery(loadSuggestions);

  const onPageChange = (event,newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const onSizeChange = (event) => {
    setPageSize(event.target.value);
    setPageIndex(1);
  };

  useEffect( () =>{
    const from = (pageIndex - 1) * pageSize;
    props.requestSearchList(keyword , from , pageSize);
  },[keyword,pageIndex,pageSize])

  let tenants = props.tenants;
  let total = 0;
  const loaded = (tenants.hits !== undefined);
  if(loaded){
    total = tenants.hits.total;
    tenants = tenants.hits.hits.map(hit => {
          hit._source.data.highlight=hit.highlight;
          return hit._source.data;
        }
    );
  }

  const count = Math.floor(total / pageSize) + ((total % pageSize)===0 ? 0 : 1);
  const Pager=<Pagination count={count} page={pageIndex} onChange={onPageChange.bind()} />;

  return (
    <React.Fragment>
      {BLOCK}
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
      <SuTechGrid
        title={"テナント一覧(" + props.operationType + ")"}
        gridConf={gridConf}
        datas={tenants}
        goDetailHandler={props.selectGoToDetail}
        selectToBase="/tenant/profile"
        deleteHandler={props.requestDel}
        requestSearchList={props.requestSearchList}
      />
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
      <FabLink to="/tenant/add" onClick={props.goToAdd} />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    blocking: state.tenant.blocking,
    tenants : state.list.tenants,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestSearchList: (keyword,from,size) => dispatch(requestSearchList(keyword,from,size)),
    requestDel: (id) => dispatch(tenantAppModule.requestDel(id)),
    goToAdd: () => dispatch(goToAdd()),
    selectGoToDetail: (tenant) =>
      dispatch(tenantAppModule.selectGoToDetail(tenant)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantList);
