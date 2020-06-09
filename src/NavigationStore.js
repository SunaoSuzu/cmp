import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import history from "./asset/history";
import { routerMiddleware, connectRouter } from "connected-react-router";
import navigationReducer from "./NavigationModule";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./notification/saga/Polling";

const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [routeMiddleware,sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {

    const store =  createStore(
        combineReducers({
          router: connectRouter(history),
          navigationReducer,
        }),
        initialState,
        composeEnhancers(applyMiddleware(...middlewares))
    );

  sagaMiddleware.run(rootSaga);
  return store;
}
export { history };
