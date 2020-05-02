import { createStore as reduxCreateStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import navigationReducer from './NavigationModule';


export default function createStore() {
    const store = reduxCreateStore(
            navigationReducer,
        applyMiddleware(
            logger,
        )
    );

    return store;
}


