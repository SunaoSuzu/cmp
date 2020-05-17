import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      //main: "#79cdf1",
      main: "#1976d2",
    },
    secondary: {
      //main: "#19857b"
      main: "#d39aa6",
      contrastText: "#fff",
    },
    error: {
      main: red.A400,
    },
    background: {
      //default: "#f4f4f7"
      default: "#f7f9fc",
      draweractive: "#10151c",
      drawertop: "#232f3e",
      toolbar: "#f5f5f5",
    },
  },
  typography: {
    fontSize: 12,
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#fff",
        boxShadow: "rgba(53, 64, 82, 0.05) 0px 0px 14px 0px",
        color: "rgba( 0,0,0,0.87)",
      },
    },
    MuiDrawer: {
      paper: {
        backgroundColor: "#1b2430",
        color: "#eee",
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: "0 0 14px 0 rgba(53,64,82,.05)",
      },
    },
  },
});

export default theme;
