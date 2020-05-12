import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import { Link } from "react-router-dom";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import Configuration from "../Configuration";

const useStyles = makeStyles(theme => ({
  menuIcon: {
    color: "#eee",
    marginLeft: 8,
    minWitdh: 48,
    "& svg": {
      opacity: 0.5
    }
  }
}));

export default function SideMenu(props) {
  const classes = useStyles();
  const conf = Configuration();
  const menuIcons = conf.menuIcons;
  const reportIcons = conf.reportIcons;
  const { selectMenu,selectReport  } = props;
  const { functionType , selectedMenuId,selectedReportId } = props;
  return (
      <List>
        {menuIcons.map((menu) => (
            <ListItem button component={Link} key={menu.menuId} id={menu.menuId} onClick={() => selectMenu(menu)}
                      to={menu.appTo}
                      selected={ functionType==="MENU"&&selectedMenuId===menu.menuId}>
              <ListItemIcon className={classes.menuIcon}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={menu.caption} />
            </ListItem>
        ))}
        {reportIcons.map((report ) => (
            <ListItem button component={Link} key={report.reportId} id={report.reportId} onClick={() => selectReport(report)}
                      to={"/report/" + report.reportId}
                      primary={report.caption} icon={<InboxIcon />}
                      selected={ functionType==="REPORT"&&selectedReportId===report.reportId}
            >
              <ListItemIcon className={classes.menuIcon}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={report.caption} />
            </ListItem>
        ))}
      </List>
  );
}
