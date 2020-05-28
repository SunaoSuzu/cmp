import React from "react";
import SuTechGrid from "../components/SuTechGrid";
import * as tenantAppModule from "./TenantAppModule";
import { connect } from "react-redux";
import FabLink from "../asset/FabLink";
import getConfiguration from "../Configuration";
import Pagination from "@material-ui/lab/Pagination";
import useDebouncedQuery from "../util/useDebouncedQuery";
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import {Box} from "@material-ui/core";

function TenantList(props) {
  const conf = getConfiguration();
  const gridConf = conf.tenantListGridConf;

  const [dispatched , setDispatched] = React.useState(false);
  const [pageIndex  , setPageIndex] = React.useState(1);
  const [pageSize   , setPageSize] = React.useState(50);
  const [keyword    , setKeyword] = React.useState("");
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

  if (!dispatched){
    const from = (pageIndex - 1) * pageSize;
    props.requestSearchList(keyword , from , pageSize);
    setDispatched(true);
    return Searcher;
  }

  if (props.loadSuccess === tenantAppModule.yet) {
    return (Searcher);
  }
  if (
    props.loadSuccess === tenantAppModule.requested ||
    props.deleteComplete === tenantAppModule.syncing
  ) {
    return Searcher;
  }
  if (props.loadSuccess === tenantAppModule.loadSuccess) {
    const datas = props.datas;
    const total = datas.hits.total
    const count = Math.floor(total / pageSize) + ((total % pageSize)===0 ? 0 : 1);
    const Pager=<Pagination count={count} page={pageIndex} onChange={onPageChange.bind()} />;

    return (
      <React.Fragment>
        {Searcher}
        <SuTechGrid
          title={"テナント一覧(" + props.operationType + ")"}
          gridConf={gridConf}
          datas={datas}
          goDetailHandler={props.selectGoToDetail}
          selectToBase="/tenant/profile"
          deleteHandler={props.requestDel}
          elasticSearch={true}
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
        <FabLink to="/tenant/add" onClick={props.selectGoToAdd} />
      </React.Fragment>
    );
  }
  return <div>ERROR!!!!</div>;
}

const mapStateToProps = (state) => {
  return {
    operationType: state.operationType,
    loadSuccess: state.loadSuccess,
    deleteComplete: state.deleteComplete,
    datas: state.datas,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestSearchList: (keyword,from,size) => dispatch(tenantAppModule.requestSearchList(keyword,from,size)),
    requestDel: (id) => dispatch(tenantAppModule.requestDel(id)),
    selectGoToAdd: () => dispatch(tenantAppModule.selectGoToAdd()),
    selectGoToDetail: (data) =>
      dispatch(tenantAppModule.selectGoToDetail(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TenantList);
