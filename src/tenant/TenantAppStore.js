import { createStore as reduxCreateStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import tenantAppReducer from "./TenantAppModule";
import thunk from "redux-thunk";
import {selectList} from "./TenantAppModule";


export default function createStore() {
    console.log("TenantAppStore.createStore()");
    const store = reduxCreateStore(
        tenantAppReducer,
        applyMiddleware(
            thunk , logger
        )
    );
    store.dispatch(selectList());
    return store;
}


