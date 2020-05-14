import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import AddBoxIcon from "@material-ui/icons/AddBox";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import getConfiguration from "../Configuration";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import { empty_contract } from "./TenantAppModule";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  contractBasic: {
    width: "100%",
    alignItems: "center",
  },
  contractDetails: {
    width: "100%",
    alignItems: "center",
  },
  contractDetailsItem: {
    display: "inline-block",
    verticalAlign: "middle",
  },
  contractRemarks: {
    width: "100%",
  },
}));

const ContractDetails = (props) => {
  const classes = useStyles();
  const conf = getConfiguration();
  const productLicenses = conf.productLicensesConf;

  const targetData = props.targetData;
  const uiToJson = props.uiToJson;
  const addDetail = props.addDetail;
  const delDetail = props.delDetail;

  const addDetailHandler = () => {
    addDetail("contract.details", { ...empty_contract });
  };

  const delDetailHandler = (index) => {
    console.log("delDetailHandler:" + index);
    delDetail("contract.details", index);
  };

  return (
    <React.Fragment>
      <h4>契約基礎情報</h4>
      <div>
        <h6>契約日など後で追加</h6>
      </div>
      <h4>製品ライセンス</h4>
      {targetData.contract.details.map((detail, index) => (
        <div className={classes.contractDetails} key={index}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel
              className={classes.contractDetailsItem}
              htmlFor="outlined-age-native-simple"
            >
              製品
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={detail.productMstId}
              onChange={uiToJson}
              className={classes.contractDetailsItem}
              name={"contract.details." + index + ".productMstId"}
            >
              {productLicenses.map((p) => (
                <MenuItem value={p.id} key={p.id}>
                  {p.caption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="standard-number"
            name={"contract.details." + index + ".amount"}
            label="ライセンス数"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={detail.amount}
            onChange={uiToJson}
            className={classes.contractDetailsItem}
            required
          />
          (オプションを後で追加)
          {targetData.contract.details.length > 1 ? (
            <IndeterminateCheckBoxIcon
              className={classes.contractDetailsItem}
              onClick={() => delDetailHandler(index)}
            />
          ) : null}
          {targetData.contract.details.length === index + 1 ? (
            <AddBoxIcon
              className={classes.contractDetailsItem}
              onClick={addDetailHandler}
            />
          ) : null}
        </div>
      ))}

      <Divider variant="middle" />
      <TextField
        id="outlined-multiline-static"
        name="contract.remarks"
        onChange={uiToJson}
        label="契約特記事項"
        helperText="契約特記事項"
        multiline
        fullWidth
        rows={4}
        value={targetData.contract.remarks}
        variant="outlined"
        className={classes.contractRemarks}
      />
    </React.Fragment>
  );
};
ContractDetails.propTypes = {
  targetData: PropTypes.any.isRequired,
  uiToJson: PropTypes.any.isRequired,
  addDetail: PropTypes.any.isRequired,
  delDetail: PropTypes.any.isRequired,
};

export default ContractDetails;
