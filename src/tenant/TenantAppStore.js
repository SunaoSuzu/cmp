import { createStore as reduxCreateStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import tenantAppReducer from "./TenantAppModule";


export default function createStore() {
    const store = reduxCreateStore(
            tenantAppReducer,
        applyMiddleware(
            logger,
        )
    );

    return store;
}


