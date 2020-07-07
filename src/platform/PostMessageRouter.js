import React from 'react';
import { Router } from 'react-router-dom';
import {useEffect} from "react";

function PostMessageRouter({history , children , ...props}){
    useEffect(()=>{
        const unlisten = history.listen((location, action) => {
            window.parent.postMessage(
                {
                    from : "PostMessageRouter",
                    pathname : location.pathname
                },
                '*'
            )
        });
        return unlisten;
    },[])
    return (
        <Router history={history} {...props}>
            {children}
        </Router>
    );


}
export default PostMessageRouter;