import { createStore as reduxCreateStore, compose, applyMiddleware, combineReducers } from 'redux';
import navigationReducer from './NavigationModule';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import history from './asset/history'
import NavigationModule from "./NavigationModule";
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk'


const initialState = {
    functionType : NavigationModule.HOME,
    selectedMenuId: null,
    targetReportId: null
};



export default function createStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = reduxCreateStore(
        combineReducers({
            router: connectRouter(history),navigationReducer})
        , // new root reducer with router state
        initialState,
        composeEnhancers(
            applyMiddleware(
                routerMiddleware(history), // for dispatching history actions
                thunk,
                createLogger(),

            ),
        ),
    );
    return store;
};


