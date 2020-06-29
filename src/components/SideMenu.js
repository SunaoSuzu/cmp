import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import {useMenuIcons,useReportIcons} from "../platform/UserContextProvider"
import getIcon from "../platform/MenuIcons"

const useStyles = makeStyles((theme) => ({
  menuIcon: {
    color: "#eee",
    marginLeft: 0,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 8,
    },
    minWitdh: 48,
    "& svg": {
      opacity: 0.5,
    },
  },
}));

export default function SideMenu(props) {
  const classes = useStyles();
  const menuIcons = useMenuIcons();
  const reportIcons = useReportIcons();
  const { selectMenu, selectReport } = props;
  const { functionType, selectedMenuId, selectedReportId } = props;
  return (
    <List>
      {menuIcons.map((menu) => {
        const IconTag = getIcon(menu.icon);
        return (
          <ListItem
            button
            component={Link}
            key={menu.id}
            id={menu.id}
            onClick={() => selectMenu(menu)}
            to={menu.appTo + "/" + menu.id}
            selected={functionType === "MENU" && selectedMenuId === menu.menuId}
          >
            <ListItemIcon className={classes.menuIcon}>
              <IconTag />
            </ListItemIcon>
            <ListItemText primary={menu.caption} />
          </ListItem>
        );
      })}
      {reportIcons.map((report) => {
        const IconTag = getIcon(report.icon);
        return (
          <ListItem
            button
            component={Link}
            key={report.id}
            id={report.id}
            onClick={() => selectReport(report)}
            to={"/report/" + report.id}
            selected={
              functionType === "REPORT" && selectedReportId === report.reportId
            }
          >
            <ListItemIcon className={classes.menuIcon}>
              <IconTag />
            </ListItemIcon>
            <ListItemText primary={report.caption} />
          </ListItem>
        );
      })}
    </List>
  );
}
