import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import SuTechIcon from "../../components/SuTechIcon";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Cover from "../../asset/bg_top_x2.png";
import {useAuthenticateInfo, usePwdChgHandler} from "../UserContextProvider";
import { Link } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.sutech.co.jp/">
        SuTech
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: `url(${Cover})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "right"
  },
  paper: {
    margin: theme.spacing(12, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(2)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  logo: {
    height: "36px",
    marginBottom: theme.spacing(3)
  }
}));

export default function SignInSide() {
  const classes = useStyles();
  const pwdChgHandler = usePwdChgHandler();
  const {message} = useAuthenticateInfo();

  const challengePasswordChange = function challengeAuthentication() {
    const user = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const nowPwd = document.getElementById("current-password").value;
    const newPwd = document.getElementById("new-password").value;
    pwdChgHandler(user,nowPwd,name,newPwd);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <SuTechIcon />
          <form className={classes.form} noValidate>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="current-password"
                label="Current Password"
                name="current-password"
                autoComplete="current-password"
                type="password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="new-password"
              label="New Password"
              name="new-password"
              autoComplete="new-password"
              type="password"
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={challengePasswordChange.bind()}
            >
              登録
            </Button>
            {message}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link variant="body2" to="/signUp">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
