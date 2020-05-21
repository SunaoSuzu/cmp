import React from "react";
import {connect} from "react-redux";
import * as tenantAppModule from "../TenantAppModule";
import { productMeta } from "../../conf/ProductPattern";
import {makeStyles} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import Selection from "../../components/Selection";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
    panel: {
    },
}));


const ComponentPanel = props => {
    const classes = useStyles();
    const targetComponent=props.targetComponent;
    const cindex=props.cindex;
    const index=props.index;
    const env=props.env;
    const tenant=props.tenant;
    const uiToJson = props.changeProperty;

    //ForDirtyData(今は全部Dirtyなので、いずれ改善)
    if(env.strategy==undefined)env.strategy={};
    if(env.strategy.web==undefined)env.strategy.web={};
    if(env.strategy.bastion==undefined)env.strategy.bastion={};

    const basePath = "";
    return (
        <Box className={classes.panel} display="flex">
            <Box flexDirection="row" justifyContent="flex-start">
                <Selection input={true}
                           label="Web公開方式"
                           name={"environments." + index + ".strategy.web.publishing"}
                           onChange={uiToJson}
                           id="standard-strategy-web-publishing"
                           value={env.strategy.web.publishing}
                           helperText="環境状態"
                           margin="dense"
                           options={[{id:1, caption: "直接公開"},{id:2 , caption : "with ELB" ,},{id:3, caption : "with ALB"}]}
                />
                <Selection input={true}
                           label="Minimum AZ"
                           name={"environments." + index + ".strategy.web.minimumAz"}
                           onChange={uiToJson}
                           id="standard-strategy-web-minimum-az"
                           value={env.strategy.web.minimumAz}
                           helperText="Minimum AZ"
                           margin="dense"
                           options={[{id:1, caption: "1"},{id:2 , caption : "2" ,},{id:3, caption : "3"}]}
                />
                <Divider />
            </Box>
            <Box flexDirection="row" justifyContent="flex-start">
                <Selection input={true}
                           label="SSH Bastion"
                           name={"environments." + index + ".strategy.bastion.create"}
                           onChange={uiToJson}
                           id="standard-strategy-bastion-create"
                           value={env.strategy.bastion.create}
                           helperText="SSH Bastion"
                           margin="dense"
                           options={[{id:0, caption: "作らない"},{id:1 , caption : "作る" ,}]}
                />
                <TextField
                    name={"environments." + index + ".strategy.bastion.accessFroms"}
                    onChange={uiToJson}
                    id="standard-strategy-bastion-access-froms"
                    label="許可するIP"
                    helperText="許可するIP(,区切り)"
                    value={env.strategy.bastion.accessFroms}
                />

            </Box>
        </Box>
    )
}
const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeProperty: (e) => dispatch(tenantAppModule.changeProperty(e)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ComponentPanel);
