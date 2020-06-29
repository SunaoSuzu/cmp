import AccountBoxIcon from "@material-ui/icons/AccountBoxOutlined";
import BusinessIcon from "@material-ui/icons/BusinessOutlined";
import CodeIcon from "@material-ui/icons/CodeOutlined";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import CloudDownloadIcon from "@material-ui/icons/CloudDownloadOutlined";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import DashboardIcon from "@material-ui/icons/DashboardOutlined";
import ReportIcon from "@material-ui/icons/ReportOutlined";
import NoteIcon from "@material-ui/icons/NoteOutlined";

const defaultSet = {
    accountBox : AccountBoxIcon,
    business   : BusinessIcon,
    code : CodeIcon,
    assignment : AssignmentIcon,
    notifications : NotificationsIcon,
    cloudDownload : CloudDownloadIcon,
    settingsApplications : SettingsApplicationsIcon,
    appsOutlined : AppsOutlinedIcon,
    dashboard : DashboardIcon,
    report : ReportIcon,
    note : NoteIcon,
}
export default function icon(name){
    const ret = defaultSet[name];
    if(ret===null||ret===undefined){
        console.log("アイコン見つかりません。name:" + JSON.stringify(name));
        return NoteIcon;
    }
    return defaultSet[name];
}

export function getOptions(){
    return Object.keys(defaultSet).map( name => ({ id : name , icon : defaultSet[name] }))
}
