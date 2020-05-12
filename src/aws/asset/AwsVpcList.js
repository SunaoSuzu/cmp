import React from "react";
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import * as AwsAppModule from "../AwsAppModule";
import Button from '@material-ui/core/Button';

const AwsVpcList = (props) => {
    const store = function store(){
        props.requestStore(props.importedData);
    };
    const importBtnDisable = !(props.importComplete === AwsAppModule.yet);
    const storeBtnDisable  = !(props.storeComplete === AwsAppModule.necessary);
    return (
        <React.Fragment>
            <Button
                variant="contained"
                color="primary"
                onClick={props.requestImport}
                disabled={importBtnDisable}
            >
                取り込み
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={store}
                disabled={storeBtnDisable}
            >
                保存
            </Button>
            <div>{props.requestStore}</div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        importComplete :state.importComplete,
        importedData : state.importedData,
        storeComplete:state.storeComplete,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        requestImport: ()     => dispatch(AwsAppModule.requestImport()),
        requestStore : (data) => dispatch(AwsAppModule.requestStore(data)),
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AwsVpcList));
