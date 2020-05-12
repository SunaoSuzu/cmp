import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    color: "rgba(0,0,0,0.87)",
    fontSize: "1.2rem",
    lineHeight: 1.2
  },
  pgtdivide: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }
}));

export default function PageTitle(props) {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Typography
        component="h2"
        variant="h6"
        gutterBottom
        className={classes.root}
      >
        {props.children}
      </Typography>
      <Divider className={classes.pgtdivide} />
    </Grid>
  );
}

PageTitle.propTypes = {
  children: PropTypes.node
};
