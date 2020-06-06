import { applyMiddleware, compose, createStore } from 'redux'
import reducer from "./OperationAppModule";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import rootSaga from "./saga/OperationAppSaga";

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(preloadedState) {
    const middlewares = [sagaMiddleware,logger];
    const middlewareEnhancer = applyMiddleware(...middlewares);
    const enhancers = [middlewareEnhancer];
    const composedEnhancers = compose(...enhancers);
    const store = createStore(reducer, preloadedState, composedEnhancers);
    sagaMiddleware.run(rootSaga);
    return store
}
