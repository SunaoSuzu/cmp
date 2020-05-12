import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../asset/logoIcon.png"; // Tell Webpack this JS file uses this image

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        "& img": {
            height: "36px"
        },
        "& div": {
            display: "inline-block",
            height: 36,
            fontSize: "1.2rem",
            color: "#263340",
            fontWeight: 500,
            verticalAlign: "bottom",
            marginLeft: 8
        }
    }
});

export default function Logo() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <img src={logo} alt="Logo" />
            <div>Cloud Management Platform</div>
        </div>
    );
}
