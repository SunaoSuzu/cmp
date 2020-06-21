import React, {useEffect} from 'react';
import MaterialTable from 'material-table';
import {useDispatch, useSelector} from "react-redux";
import {useDef} from "../AppProvider";
import {getList} from "../modules/ListModifyModule";
import {add} from "../modules/AddModule";
import {update} from "../modules/ProfileModule";


export default function ListModifyComponent() {
    const list = useSelector(state => state.listMod.list);
    const def = useDef();
    const dispatch = useDispatch();

    useEffect( () => {
            dispatch(getList());
    },[def])

    return (
        <MaterialTable
            title="Modify"
            columns={def.schema.fields}
            data={list}
            editable={{
                onRowAdd: (newData) =>
                    new Promise((resolve, reject) => {
                        dispatch(add(newData));
                        resolve()
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        dispatch(update(newData));
                        resolve()
                    }),
                onRowDelete: (oldData) => dispatch(update(oldData)),
            }}
        />
    );
}
