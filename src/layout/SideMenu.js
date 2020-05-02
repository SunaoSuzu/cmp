import React from 'react';
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import {makeStyles} from "@material-ui/core/styles";
import { Link as RouterLink } from 'react-router-dom';

const menuIconsDef= [
    {menuId:1 , caption : "Activity" , icon:"" , appTo:"/activity"},
    {menuId:2 , caption : "テナント" , icon:"", appTo:"/tenant" },
    {menuId:3 , caption : "プロダクト" , icon:"", appTo:"/product" },
    {menuId:4 , caption : "作業予実" , icon:"", appTo:"/operation" },
    {menuId:5 , caption : "通知" , icon:"" , appTo:"/home"},
]

const reportIconsDef= [
    {reportId:11 , caption : "レポート" , icon:"" ,reportTo:"report"},
    {reportId:12 , caption : "レポート" , icon:"" ,reportTo:"report"},
    {reportId:13 , caption : "レポート" , icon:"" ,reportTo:"report"},
]

const drawerWidth = 240;
const useStyle = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
}));

function ListItemLink(props) {
    const { icon, primary, to, key , onClick , selected } = props;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink} key={key} selected={selected} onClick={onClick}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}



export default function SideMenu(props) {
    const menuIcons = menuIconsDef
    const reportIcons = reportIconsDef
    const classes=useStyle();
    const { selectMenu,selectReport  } = props;
    const { functionType , selectedMenuId,selectedReportId } = props;

    return (
        <React.Fragment>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <List>
                        {menuIcons.map((menu, index) => (
                            <ListItemLink  key={menu.menuId} onClick={() => selectMenu(menu)}
                                          to={menu.appTo}
                                          selected={ functionType==="MENU"&&selectedMenuId===menu.menuId ? true : false}
                                          primary={menu.caption} icon={<InboxIcon />}
                            >
                            </ListItemLink>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {reportIcons.map((report, index) => (
                            <ListItemLink button key={report.reportId} onClick={() => selectReport(report)}
                                          to={"/report/" + report.reportId}
                                          primary={report.caption} icon={<InboxIcon />}
                            selected={ functionType==="REPORT"&&selectedReportId===report.reportId ? true : false}>
                            </ListItemLink>
                        ))}
                    </List>
                </div>
            </Drawer>
        </React.Fragment>
    );
}
