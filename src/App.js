import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';



//自作
import Navigation from "./Navigation.js_bkbk";

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
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
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));


export default function App (prop) {
    console.log('App:function' + prop.selectMenu);
    const classes = useStyles();
    return <Navigation styles={classes} prop={prop} />
}