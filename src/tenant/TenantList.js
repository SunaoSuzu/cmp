import React from "react";
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


function TenantList(props) {
  const conf = getConfiguration();
  const gridConf = conf.tenantListGridConf;

  const [dispatched , setDispatched] = React.useState(true);
  const [pageIndex  , setPageIndex] = React.useState(1);
  const [pageSize   , setPageSize] = React.useState(50);
  const [keyword   , setKeyword] = React.useState(50);

  let BLOCK = null;
  const loadSuggestions = (query) => {
    setKeyword(query);
    setDispatched(false);
  }
  const { searchQuery, setSearchQuery } = useDebouncedQuery(loadSuggestions);

  const Searcher = <Input type="search" name="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

  const onPageChange = (event,newPageIndex) => {
    setPageIndex(newPageIndex);
    setDispatched(false);
  };

  const onSizeChange = (event) => {
    setPageSize(event.target.value);
    setPageIndex(1);
    setDispatched(false);
  };

  if(dispatched){
    BLOCK="";
  }else{
    const from = (pageIndex - 1) * pageSize;
    props.requestSearchList(keyword , from , pageSize);
    BLOCK=<ActionProgress/>
    setDispatched(true);
  }
  let tenants = props.tenants;
  let total = 0;
  const loaded = (tenants.hits !== undefined);
  if(loaded){
    total = tenants.hits.total;
    tenants = tenants.hits.hits.map(hit => {
          hit._source.highlight=hit.highlight;
          return hit._source.data;
        }
    );
  }

  const count = Math.floor(total / pageSize) + ((total % pageSize)===0 ? 0 : 1);
  const Pager=<Pagination count={count} page={pageIndex} onChange={onPageChange.bind()} />;

  return (
    <React.Fragment>
      {BLOCK}
      {Searcher}
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
