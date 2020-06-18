import React from "react";
import clsx from "clsx";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import AccountCircle from "@material-ui/icons/AccountCircleOutlined";
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import MoreIcon from "@material-ui/icons/MoreVertOutlined";
import SuTechIcon from "./SuTechIcon";
import { Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeftOutlined";
import SideMenu from "./SideMenu";
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {useLogoutHandler} from '../UserContextProvider';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 4px",
    ...theme.mixins.toolbar,
    "& Button": {
      color: "rgba(255,255,255,0.54)",
    },
  },
  appBar: {
    marginLeft: theme.spacing(2),
    width: `calc(100% -  ` + theme.spacing(7) + `px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% -  ` + theme.spacing(9) + `px)`,
    },
    //backgroundColor: theme.palette.background.appbar,
    //color: theme.palette.text.appbar,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 0,
    [theme.breakpoints.up("sm")]: {
      marginRight: 9,
    },
  },
  menuButtonHidden: {
    display: "none",
  },
  logo: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.05),
    },
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: "auto",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(2),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "0ch",
    "&:focus": {
      width: "12ch",
    },
    [theme.breakpoints.up("sm")]: {
      width: "8ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerContainer: {
    overflow: "auto",
  },
  menuLink: {
    textDecoration: "none",
  },
  menuIcon: {
    color: "#eee",
    marginLeft: 8,
    minWitdh: 48,
    "& svg": {
      opacity: 0.5,
    },
  },
}));

export default function SiteHeader(props) {
  const classes = useStyles();
  const { selectMenu, selectReport } = props;
  const { functionType, selectedMenuId, selectedReportId } = props;
  const {targetOperations} = props;
  const logoutHandler = useLogoutHandler();

  const anchor = "left";
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const [anchorNotify, setAnchorNotify] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationOpen = Boolean(anchorNotify);

  const handleNotificationOpen = (event) => {
    setAnchorNotify(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setAnchorNotify(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* modified by asaka 0513 */}
      <MenuItem onClick={props.selectProfile} component={Link} to="/profile">
        Profile
      </MenuItem>
      <MenuItem onClick={props.selectAccount} component={Link} to="/account">
        My account
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>Close</MenuItem>
      <MenuItem onClick={logoutHandler} component={Link} to="/signIn">
        Logout
      </MenuItem>
      {/* modified by asaka 0513 */}
    </Menu>
  );

  const notifyId = "notification-menu";
  const noticications = (
      <Menu
          anchorEl={anchorNotify}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          id={notifyId}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isNotificationOpen}
          onClose={handleNotificationClose}
      >
        {
          targetOperations.map( (job , index) => (
              <MenuItem key={index} onClick={handleNotificationClose}>
                <ListItemIcon>
                  <CircularProgress size="1rem" />
                </ListItemIcon>
                <ListItemText primary={job.jobId} />
              </MenuItem>
          ))
        }
      </Menu>
  );

  const open = state[anchor];
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <Link to="/notice">
        <MenuItem onClick={handleNotificationOpen}>
          <IconButton aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={targetOperations.length} color="secondary">
              <CloudQueueIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
      </Link>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <React.Fragment>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          {/* <Link to="/home"> */}
          <SuTechIcon onClick={props.selectHome} component={Link} to="/home" />
          {/* </Link> */}
          <div className={classes.grow} />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <div className={classes.sectionDesktop}>
            {/* <Link to="/notice"> */}
            <IconButton
              aria-label="show 4 new mails"
              color="inherit"
              onClick={handleNotificationOpen}
            >
              <Badge badgeContent={targetOperations.length} color="secondary">
                <CloudQueueIcon />
              </Badge>
            </IconButton>
            {/* </Link> */}
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {noticications}
      {renderMobileMenu}
      {renderMenu}
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        anchor={anchor}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton
            onClick={toggleDrawer("left", true)}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={toggleDrawer(anchor, false)}
            className={clsx(
              classes.menuButton,
              !open && classes.menuButtonHidden
            )}
          >
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <SideMenu
          selectMenu={selectMenu}
          selectReport={selectReport}
          functionType={functionType}
          selectedMenuId={selectedMenuId}
          selectedReportId={selectedReportId}
        />
        <Divider />
      </Drawer>
    </React.Fragment>
  );
}
