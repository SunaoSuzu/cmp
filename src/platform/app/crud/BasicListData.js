import React from "react";
import FabLink from "../../../asset/FabLink";
import BasicLayout from "../../component/layout/BasicLayout";
import {useBackedToList} from "../../CrudProvider";
import Grid from "../../component/GridComponent"


const List = ({def,list,children,prefix,canAdd=true}) => {

    const {toList,showList} = useBackedToList();
    if(toList)showList();

    const gotoAdd = () => {
    };

    return (
        <BasicLayout title={prefix + "一覧"}>
            {children}
            <Grid def={def} list={list} />
            {canAdd&&<FabLink to="./profile/new" onClick={gotoAdd} />}
        </BasicLayout>
    );
}

export default List;