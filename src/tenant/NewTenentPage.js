import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from '@material-ui/core/InputLabel';
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import Configuration from "../Configuration";

const useStyles = makeStyles((theme) => ({
    functionPanel: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.grey["200"],
        width : "100%",
        alignItems : "center",
    },
    functionPanelLeft :{
        flexGrow: 1,
    },
    functionPanelRight :{
        textAlign: "right",
    },
    basicInformationPanel: {
        margin: theme.spacing(1),
    },
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
}));

export default function NewTenantPage(props) {
    const classes = useStyles();
    const conf = Configuration();
    const productLicenses = conf.productLicenses;
    console.log(productLicenses);
    const { addData , changePropertyOfNew,addComplete,newData } = props;
    const send = function send(){
        addData(newData);
    };


    return (
        <React.Fragment>
            <form  encType='multipart/form-data' >
                <div className={classes.functionPanel}>
                    <div className={classes.functionPanelLeft}>
                    </div>
                    <div className={classes.functionPanelRight} >
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                            onClick={send.bind(this)}
                        >
                            Save
                        </Button>
                    </div>
                </div>
                <div className={classes.basicInformationPanel} >
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel >テナント名</InputLabel>
                        <TextField name="name" onChange={changePropertyOfNew} id="standard-basic" label="テナント名"  helperText="会社名を入れてください" />
                    </FormControl>
                </div>
                <Divider variant="middle" />
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">製品</InputLabel>
                    <Select
                        native
                        label="製品"
                        inputProps={{
                            name: 'contract.details.0.productMstId',
                            id: 'outlined-age-native-simple',
                        }}
                        onChange={changePropertyOfNew}
                    >
                        <option value="1" >CJK</option>
                        <option value="2" >CWS</option>
                        <option value="4" >CSR</option>
                        <option value="3" >CTM</option>
                    </Select>
                </FormControl>
                <TextField
                    id="standard-number"
                    name="contract.details.0.amount"
                    label="ライセンス数"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={changePropertyOfNew}
                />
                <Divider variant="middle" />
                <TextField
                    id="standard-multiline-static"
                    multiline
                    rows={5}
                    name="contract.remarks"
                    label="特記事項"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={changePropertyOfNew}
                />
            </form>
        </React.Fragment>
    )
}
