import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import logo from './Logo_H_x2.png'

const useStyles = makeStyles((theme) => ({
    sutechlogo: {
        width:'100px',
        height:'30px',
        objectFit:'contain' ,
    },
}));


export default function SuTechIcon (props)
{
    const classes = useStyles();

    return (
        <div onClick={props.onClick} >
            <img alt="logo_H_x2.png" className={classes.sutechlogo} src={logo} onClick={props.onClick} />
        </div>
    );
}
