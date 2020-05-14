import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../asset/aws/Virtual-private-cloud-VPC_light-bg@4x.png"; // Tell Webpack this JS file uses this image

const useStyles = makeStyles({
  logo: {
    height: "20px",
  },
});

export default function Logo() {
  const classes = useStyles();
  return <img src={logo} alt="Logo" className={classes.logo} />;
}
