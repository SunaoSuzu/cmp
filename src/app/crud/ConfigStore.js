import { applyMiddleware, compose, createStore } from 'redux'
import reducer from "./modules";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import rootSaga from "./sagas";


export default function configureStore(def) {
    const sagaMiddleware = createSagaMiddleware({context : def});
    const middlewares = [sagaMiddleware,logger];
    const middlewareEnhancer = applyMiddleware(...middlewares);
    const enhancers = [middlewareEnhancer];
    const composedEnhancers = compose(...enhancers);
    const store = createStore(reducer, undefined, composedEnhancers);
    sagaMiddleware.run(rootSaga);
    return store
}
