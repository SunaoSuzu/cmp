import React, {useEffect, useMemo, useReducer} from "react"
import * as a from "./util/BasicActions"
import {useIdToken} from "./UserContextProvider";
import ActionProgress from "../components/ActionProgress";
import ErrorPage from "./ErrorPage";

const initialState = {
    loading : false,
    fetcher : {},
    error   : null,
    list    : [],
    toList  : false,
};

const base = process.env.REACT_APP_DEV_PLATFORM + "/data";
const CrudContext = React.createContext(initialState);

const reducer = (state, action) => {
    console.log("type:" + action.type + " payload:" + JSON.stringify(action.payload));
    switch (action.type) {
        case a.INIT:
            return initialState;
        case a.SHOW_LIST:
            return {...state , toList: false};
        case a.LIST:
        case a.ADD:
        case a.UPDATE:
        case a.DEL:
            return {...state , loading: true , toList: false};
        case a.ON_SUCCESS_LIST:
            return {...state , loading: false , list: action.payload};
        case a.ON_SUCCESS_ADD:
            return {...state , loading: false , list: state.list.concat(action.payload) , toList: true};
        case a.ON_SUCCESS_UPDATE:
            {
                const index = state.list.findIndex( data => data.id === action.payload.id);
                const array = [...state.list]
                array[index]=action.payload;
                return {...state , loading: false , list: array , toList: true};
            }
        case a.ON_SUCCESS_DEL:
            const index = state.list.findIndex( data => data.id === action.payload);
            const array = [...state.list]
            array.splice(index,1);
            return {...state , loading: false , list: array , toList: true};
        case a.FETCHER:{
            const fetcher = {...state.fetcher}
            fetcher[action.payload]={loading : true , result : null , error : null};
            return {...state , fetcher};
        }
        case a.ON_SUCCESS_FETCHER:{
            const fetcher = {...state.fetcher}
            fetcher[action.payload.name]={loading : false , result : action.payload.data , error : null};
            return {...state , fetcher};
        }
    }
}

const CrudProvider = ({db , table , children}) => {
    const [state , dispatch] = useReducer(reducer , initialState);
    const token = useIdToken();
    const baseUrl = base + "/" + db + "/" + table;

    const headers = useMemo( () => {
        return {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `${token}`,
        }
    },[token])

    useEffect( () => {
        dispatch({type : a.INIT});
        (async () => {
            const url = baseUrl + "?limit=1000";
            dispatch({type : a.LIST});
            await fetch(url, {
                headers,
            }).then( response => response.json()).then(response => {
                dispatch({type : a.ON_SUCCESS_LIST , payload : response});
            }).catch( error  => {
                dispatch({type : a.ERROR , error: error.statusText});
            });
        })();
        return () => {
            dispatch({type : a.INIT});
        }
    },[])

    const addHandler = async function(data){
        dispatch({type : a.ADD , payload : data});
        const url = baseUrl;
        await fetch(url, {
            headers,
            method: "POST",
            body: JSON.stringify(data),
        }).then( response => response.json()).then(response => {
            dispatch({type : a.ON_SUCCESS_ADD , payload : response});
        }).catch( error  => {
            dispatch({type : a.ERROR , error: error.statusText});
        });
    }

    const updateHandler = async function(data){
        dispatch({type : a.UPDATE , payload : data});
        const url = baseUrl + "/" + data.id;
        await fetch(url, {
            headers,
            method: "PUT",
            body: JSON.stringify(data),
        }).then( response => response.json()).then(response => {
            dispatch({type : a.ON_SUCCESS_UPDATE , payload : response});
        }).catch( error  => {
            dispatch({type : a.ERROR , error: error.statusText});
        });
    }

    const delHandler = async function(id){
        dispatch({type : a.DEL , payload : id});
        const url = baseUrl + "/" + id;
        await fetch(url, {
            headers,
            method: "DELETE",
        }).then( response => response.json()).then(response => {
            dispatch({type : a.ON_SUCCESS_DEL , payload : response});
        }).catch( error  => {
            dispatch({type : a.ERROR , error: error.statusText});
        });
    }

    const useFetcher = async function(name , url){
        useEffect(()=>{
            (async () => {
                dispatch({type : a.FETCHER , payload : name });
                const response = await fetch(url, {
                    headers,
                    method: "GET",
                }).then( response => response.json()).then(response => {
                    dispatch({type : a.ON_SUCCESS_FETCHER , payload : { name : name , data : response}});
                }).catch( error  => {
                    dispatch({type : a.ERROR , error: response.statusText});
                });
            })();
        },[name])
        return state.fetcher?.data;
    }

    const showList = function(){
        dispatch({type : a.SHOW_LIST});
    }

    const blocking = state.loading||Object.keys(state.fetcher).some( name => state.fetcher[name].loading);
    if(state.error){
        return <ErrorPage error={state.error} />
    }
    const BLOCK = blocking ? <ActionProgress/> : "";
    return (
        <CrudContext.Provider value={{...state,addHandler,updateHandler,delHandler,useFetcher,showList}} >
            {BLOCK}
            {children}
        </CrudContext.Provider>
    )
}

export function useList(){
    const ctx = React.useContext(CrudContext);
    return ctx.list;
}

export function useBackedToList(){
    const ctx = React.useContext(CrudContext);
    return {toList : ctx.toList , showList : ctx.showList};
}

export function useFetcher(name , db , table , id){
    const url = id ? base + "/" + db + "/" + table + "/" +id : base + "/" + db + "/" + table;
    const ctx = React.useContext(CrudContext);
    return ctx.useFetcher(name , url);
}

export function useGetById(id){
    const ctx = React.useContext(CrudContext);
    return ctx.list.find( d => (d.id == id));　//型が違うことがあるので厳密に比較しない
}

export function useHandlers(){
    const ctx = React.useContext(CrudContext);
    return { loading : ctx.loading , error : ctx.error , toList : ctx.toList , add : ctx.addHandler,update : ctx.updateHandler,del : ctx.delHandler};
}

export default CrudProvider;