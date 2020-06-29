import React from "react";
import {Redirect, Route, Switch, useRouteMatch , useParams} from "react-router-dom";
import {useList , useGetById} from "../CrudProvider";
import ListComponent from "../app/crud/BasicListData"
import {MODE_ADD} from "../util/BasicActions"

const CustomCrudContainer = ({Detail , ...props}) => {
    const list = useList();
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Redirect exact from={path} to={path + "/list"} />
            <Route exact path={path + "/list"} >
                <ListComponent list={list} {...props} />
            </Route>
            <Route exact path={path + "/profile/new"} >
                <Detail mode={MODE_ADD} {...props} />
            </Route>
            <Route exact path={path + "/profile/:id"} >
                <DetailLauncher Detail={Detail} {...props} />
            </Route>
        </Switch>
    )
}

const DetailLauncher = ({Detail, ...props }) => {
    const { id } = useParams();
    const data = useGetById(id);
    console.log("id:" + id);
    console.log("data:" + data);
    return <Detail {...props} mode={MODE_ADD} data={data} />
}

export default CustomCrudContainer