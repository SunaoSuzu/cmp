import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function FabLink(props) {
  const classes = useStyles();
  const { to, onClick } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <Fab
      aria-label="Add"
      className={classes.fab}
      color="primary"
      component={renderLink}
      onClick={onClick}
    >
      <AddIcon />
    </Fab>
  );
}

FabLink.propTypes = {
  children: PropTypes.node,
  to: PropTypes.any.isRequired,
  onClick: PropTypes.any.isRequired,
};
