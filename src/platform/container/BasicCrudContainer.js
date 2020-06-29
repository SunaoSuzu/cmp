import React from "react";
import {Redirect, Route, Switch, useRouteMatch , useParams} from "react-router-dom";
import {useList , useGetById} from "../CrudProvider";
import List from "../app/crud/BasicListData"
import Add  from "../app/crud/BasicNewData"
import Profile from "../app/crud/BasicUpdateData"


const BasicCrudContainer = ({def , ...props}) => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Redirect exact from={path} to={path + "/list"} />
            <Route exact path={path + "/list"} >
                <ListLauncher def={def} prefix={def.title} {...props} />
            </Route>
            <Route exact path={path + "/profile/new"} >
                <Add  def={def} prefix={def.title} />
            </Route>
            <Route exact path={path + "/profile/:id"} >
                <DetailLauncher {...props} def={def} prefix={def.title} />
            </Route>
        </Switch>
    )
}

const ListLauncher = ({def, ...props }) => {
    const list = useList();
    return <List list={list} def={def} {...props} />
}
const DetailLauncher = ({def, ...props }) => {
    const { id } = useParams();
    const data = useGetById(id);
    return <Profile {...props} data={data} def={def} />
}

export default BasicCrudContainer