import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../asset/Logo_H_x2.png"; // Tell Webpack this JS file uses this image

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    "& img": {
      height: "36px"
    }
  }
});

export default function Logo() {
  const classes = useStyles();
  return (
    <span className={classes.root}>
      <img src={logo} alt="Logo" />
    </span>
  );
}
